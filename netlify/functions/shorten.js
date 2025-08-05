// netlify/functions/shorten.js
exports.handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const { originalUrl } = body;

  if (!originalUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing originalUrl' }),
    };
  }

  // Generate short slug
  const slug = Math.random().toString(36).substring(2, 8);

  // Save slug & URL in a flat JSON file
  const fs = require('fs');
  const path = require('path');
  const dbPath = path.resolve(__dirname, 'db.json');

  let db = {};
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }

  db[slug] = originalUrl;
  fs.writeFileSync(dbPath, JSON.stringify(db));

  return {
    statusCode: 200,
    body: JSON.stringify({ slug }),
  };
};
