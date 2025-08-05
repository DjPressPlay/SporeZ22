exports.handler = async (event) => {
  const slug = event.path.replace('/.netlify/functions/redirect/', '');
  const fs = require('fs');
  const path = require('path');
  const dbPath = path.resolve(__dirname, 'db.json');

  if (!fs.existsSync(dbPath)) {
    return { statusCode: 404, body: 'DB not found' };
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const target = db[slug];

  if (target) {
    return {
      statusCode: 302,
      headers: {
        Location: target,
      },
    };
  }

  return {
    statusCode: 404,
    body: 'Not found',
  };
};
