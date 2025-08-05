const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, "../../sporez.json");

exports.handler = async (event) => {
  const slug = event.path.replace("/", "");
  if (!slug) return { statusCode: 400, body: "No slug provided" };

  if (!fs.existsSync(dbPath)) {
    return { statusCode: 404, body: "DB not found" };
  }

  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  const targetUrl = db[slug];

  if (targetUrl) {
    return {
      statusCode: 302,
      headers: { Location: targetUrl },
    };
  } else {
    return { statusCode: 404, body: "Spore not found." };
  }
};
