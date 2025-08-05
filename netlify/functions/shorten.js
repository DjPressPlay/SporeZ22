// netlify/functions/shorten.js
// netlify/functions/shorten.js

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

function readData() {
  try {
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
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
    const originalUrl = body.url;

    if (!originalUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No URL provided' }),
      };
    }

    // Load existing data
    const data = readData();

    // Check if URL already exists
    const existingSlug = Object.keys(data).find(slug => data[slug] === originalUrl);
    if (existingSlug) {
      return {
        statusCode: 200,
        body: JSON.stringify({ shortenedUrl: `https://sporez.netlify.app/${existingSlug}` }),
      };
    }

    // Generate a unique slug
    let slug;
    do {
      slug = Math.random().toString(36).substring(2, 8);
    } while (data[slug]);

    data[slug] = originalUrl;
    writeData(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ shortenedUrl: `https://sporez.netlify.app/${slug}` }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};
