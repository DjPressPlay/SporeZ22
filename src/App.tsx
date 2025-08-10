// src/App.tsx
import React, { useState, useEffect } from "react";
import SporeOverlay from "./SporeOverlay";

type Spore = { slug: string; url: string; stats?: any; ts: number };

function ensureSessionId() {
  let sid = sessionStorage.getItem("session_id");
  if (!sid) {
    sid = (crypto as any)?.randomUUID?.() || String(Date.now());
    sessionStorage.setItem("session_id", sid);
  }
  return sid;
}

function SavedSporez() {
  const [spores, setSpores] = useState<Spore[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("spores");
    const list: Spore[] = stored ? JSON.parse(stored) : [];
    // newest first (by ts), limit 6
    list.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    setSpores(list.slice(0, 6));
  }, []);

  if (spores.length === 0) {
    return (
      <div style={{ marginTop: "2rem", opacity: 0.5 }}>
        <p>🧬 No saved Sporez yet.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <h2
        style={{
          fontSize: "1.4rem",
          color: "#00f0ff",
          marginBottom: "1rem",
          borderBottom: "1px solid #00f0ff55",
          paddingBottom: "0.5rem",
        }}
      >
        Saved Sporez:
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
        {spores.map(({ slug, url, stats }, idx) => (
          <li
            key={slug}
            style={{
              position: "relative",
              margin: 0,
              background: "linear-gradient(180deg, #00141f 0%, #001a26 100%)",
              padding: "1rem",
              borderRadius: 14,
              border: "1px solid rgba(0,240,255,0.28)",
              boxShadow:
                idx === 0
                  ? "0 18px 48px rgba(0,240,255,0.28), inset 0 0 0 1px rgba(0,255,204,0.10)"
                  : "0 12px 28px rgba(0,240,255,0.18), inset 0 0 0 1px rgba(0,255,204,0.08)",
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseEnter={(e) => (e.curre
