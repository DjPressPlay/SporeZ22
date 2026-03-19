// netlify/functions/generate.js
// Server-side Gemini call — API key never exposed to client

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!GEMINI_KEY) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Server not configured — contact support' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { prompt, mode } = body; // mode: 'scrape' | 'article'

  if (!prompt || typeof prompt !== 'string') {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing prompt' }) };
  }

  // Basic abuse guard — cap prompt length
  if (prompt.length > 8000) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Prompt too long' }) };
  }

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: mode === 'scrape' ? 512 : 8192,
          temperature: mode === 'scrape' ? 0.3 : 0.7,
        },
      }),
    });

    const data = await geminiRes.json();

    if (data.error) {
      console.error('[generate] Gemini error:', data.error);
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'AI error: ' + data.error.message }) };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'AI returned empty response' }) };
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    };

  } catch (err) {
    console.error('[generate] server error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Server error — try again' }),
    };
  }
};
