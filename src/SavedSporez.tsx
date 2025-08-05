import React, { useEffect, useState } from "react";

export default function SavedSporez() {
  const [spores, setSpores] = useState<{ slug: string; url: string }[]>([]);

  // For now, just load spores from localStorage or initialize empty
  useEffect(() => {
    const stored = localStorage.getItem("spores");
    if (stored) {
      setSpores(JSON.parse(stored));
    }
  }, []);

  if (spores.length === 0) {
    return <p style={{ opacity: 0.5 }}>🧬 No saved Sporez yet.</p>;
  }

  return (
    <div style={{ width: "100%", maxWidth: 600 }}>
      <h2>Saved Sporez</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {spores.map(({ slug, url }) => (
          <li
            key={slug}
            style={{
              marginBottom: "1rem",
              background: "#001a26",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #00f0ff88",
            }}
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00ff88", wordBreak: "break-all" }}
            >
              {url}
            </a>
            <br />
            <small style={{ color: "#00f0ff" }}>
              Short Link:{" "}
              <a
                href={`${window.location.origin}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00ffcc" }}
              >
                {window.location.origin}/{slug}
              </a>
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
