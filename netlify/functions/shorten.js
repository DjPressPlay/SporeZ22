// netlify/functions/shorten.js
// netlify/functions/shorten.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(len = 6) {
  return Math.random().toString(36).slice(2, 2 + len);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const originalUrl = (body.url || '').trim();
    const sessionId = (body.sessionId || '').trim() || null;

    if (!originalUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No URL provided' }),
      };
    }

    // Build base URL dynamically
    const host = event.headers['x-forwarded-host'] || event.headers['host'] || 'localhost:8888';
    const proto = event.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${proto}://${host}`;

    // If this URL already has a short link
    const { data: existing, error: existingErr } = await supabase
      .from('profiles')
      .select('short_code')
      .eq('type', 'short_link')
      .eq('target_url', originalUrl)
      .maybeSingle();

    if (existingErr) {
      console.error('[shorten] lookup error:', existingErr);
      return { statusCode: 500, body: JSON.stringify({ error: 'DB error (lookup)' }) };
    }

    if (existing?.short_code) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          shortenedUrl: `${baseUrl}/${existing.short_code}`,
          short_code: existing.short_code,
        }),
      };
    }

    // Generate a unique short_code
    let short_code = generateSlug();
    for (let i = 0; i < 5; i++) {
      const { data: slugHit, error: slugErr } = await supabase
        .from('profiles')
        .select('short_code')
        .eq('type', 'short_link')
        .eq('short_code', short_code)
        .maybeSingle();

      if (slugErr) {
        console.error('[shorten] slug check error:', slugErr);
        break;
      }
      if (!slugHit) break;
      short_code = generateSlug();
    }

    // Insert new short link
    const { error: insertErr } = await supabase.from('profiles').insert([
      {
        type: 'short_link',
        short_code,
        target_url: originalUrl,
        session_id: sessionId,
      },
    ]);

    if (insertErr) {
      console.error('[shorten] insert error:', insertErr);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to save short link' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        shortenedUrl: `${baseUrl}/${short_code}`,
        short_code,
      }),
    };
  } catch (err) {
    console.error('[shorten] server error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};


