// netlify/functions/redirect.js
// netlify/functions/redirect.js
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, 'data.json');

exports.handler = async (event) => {
  try {
    // Extract slug from path, e.g. "/abc123"
    const slug = event.path.replace(/^\/?/, ''); // remove leading slash

    if (!fs.existsSync(dataPath)) {
      return {
        statusCode: 404,
        body: 'Database not found',
      };
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const targetUrl = data[slug];

    if (targetUrl) {
      return {
        statusCode: 301,
        headers: {
          Location: targetUrl,
        },
      };
    } else {
      return {
        statusCode: 404,
        body: 'Short link not found',
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: `Server error: ${err.message}`,
    };
  }
};
