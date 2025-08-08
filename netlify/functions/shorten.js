// netlify/functions/shorten.js
// netlify/functions/shorten.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const originalUrl = body.url?.trim();
    const sessionId = body.sessionId || null;

    if (!originalUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No URL provided' }),
      };
    }

    // Check if URL already shortened
    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('short_code')
      .eq('target_url', originalUrl)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase fetch error:', fetchError);
      throw fetchError;
    }

    if (existing && existing.short_code) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          shortenedUrl: `https://sporez.netlify.app/${existing.short_code}`,
        }),
      };
    }

    // Generate unique short_code
    let short_code;
    let isUnique = false;
    do {
      short_code = generateSlug();
      const { data: slugExists } = await supabase
        .from('profiles')
        .select('short_code')
        .eq('short_code', short_code)
        .single();
      if (!slugExists) isUnique = true;
    } while (!isUnique);

    // Insert new short link record
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        short_code,
        target_url: originalUrl,
        session_id: sessionId,
        type: 'short_link',
      },
    ]);

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save short link' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        shortenedUrl: `https://sporez.netlify.app/${short_code}`,
      }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};

