const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, "../../sporez.json");

function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { url } = JSON.parse(event.body || "{}");
  if (!url || !url.startsWith("http")) {
    return { statusCode: 400, body: "Invalid URL" };
  }

  const slug = generateSlug();
  let db = {};

  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  }

  db[slug] = url;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ shortUrl: `https://sporez.netlify.app/${slug}`, slug }),
  };
};
