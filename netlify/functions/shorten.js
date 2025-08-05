// netlify/functions/shorten.js
// netlify/functions/shorten.js

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const originalUrl = body.url;

    if (!originalUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No URL provided' }),
      };
    }

    // Simple hash or slug generation (replace this with your logic)
    const slug = Math.random().toString(36).substring(2, 8);

    // Store logic goes here (in-memory example)
    const shortenedUrl = `https://sporez.netlify.app/${slug}`;

    // Ideally you'd save the slug→originalUrl map in a flat file or database

    return {
      statusCode: 200,
      body: JSON.stringify({ shortenedUrl }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};
