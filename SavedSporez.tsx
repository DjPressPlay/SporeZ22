// src/SavedSporez.tsx  (adjust the import path if this file isn't inside /src)
// src/SavedSporez.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Row = { short_code: string; target_url: string; created_at: string };

const SITE_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

export default function SavedSporez() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const sessionId = sessionStorage.getItem("session_id") || null;

      let q = supabase
        .from("profiles")
        .select("short_code, target_url, created_at")
        .eq("type", "short_link")
        .order("created_at", { ascending: false }) // newest first
        .limit(6); // only 6

      if (sessionId) q = q.eq("session_id", sessionId);

      const { data, error } = await q;
      if (!error && data) setRows(data);
      setLoading(false);
    })();
  }, []);

  const copy = async (slug: string) => {
    const url = `${SITE_BASE}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(slug);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  if (loading) return <p style={{ opacity: 0.6 }}>Loading…</p>;
  if (rows.length === 0) return <p style={{ opacity: 0.5 }}>🧬 No saved Sporez yet.</p>;

  return (
    <div style={wrapStyle}>
      <h2 style={titleStyle}>Saved Sporez</h2>
      <ul style={listStyle}>
        {rows.map((r, i) => {
          const shortHref = `${SITE_BASE}/${r.short_code}`;
          return (
            <li key={r.short_code} style={cardStyle(i === 0)}>
              {/* Short link = primary CTA */}
              <div style={shortRowStyle}>
                <a
                  href={shortHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={shortLinkStyle}
                  title="Open short link"
                >
                  {shortHref}
                </a>
                <button
                  onClick={() => copy(r.short_code)}
                  style={copyBtnStyle}
                  aria-label="Copy short link"
                >
                  {copied === r.short_code ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Destination URL */}
              <a
                href={r.target_url}
                target="_blank"
                rel="noopener noreferrer"
                style={destLinkStyle}
                title={r.target_url}
              >
                {r.target_url}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ————— Styles ————— */

const wrapStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 12px 0",
  fontSize: "1.2rem",
  color: "#a8faff",
  letterSpacing: "0.5px",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "14px",
};

const cardStyle = (isNewest: boolean): React.CSSProperties => ({
  position: "relative",
  background: "linear-gradient(180deg, #00141f 0%, #001a26 100%)",
  border: "1px solid rgba(0, 240, 255, 0.25)",
  borderRadius: 14,
  padding: "14px 14px 12px",
  boxShadow: isNewest
    ? "0 16px 40px rgba(0, 240, 255, 0.28), inset 0 0 0 1px rgba(0,255,204,0.08)"
    : "0 10px 28px rgba(0, 240, 255, 0.16), inset 0 0 0 1px rgba(0,255,204,0.06)",
  transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
  transform: "translateZ(0)",
});

const shortRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: 8,
};

const shortLinkStyle: React.CSSProperties = {
  display: "inline-block",
  fontSize: "1.05rem",
  color: "#00ffcc",
  textDecoration: "none",
  background: "rgba(0,255,204,0.12)",
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(0,255,204,0.45)",
  boxShadow: "0 0 0 3px rgba(0,255,204,0.08) inset",
  wordBreak: "break-all",
};

const copyBtnStyle: React.CSSProperties = {
  fontSize: ".85rem",
  border: "1px solid rgba(168, 250, 255, 0.35)",
  background: "rgba(0, 240, 255, 0.10)",
  color: "#a8faff",
  padding: "8px 10px",
  borderRadius: 10,
  cursor: "pointer",
};

const destLinkStyle: React.CSSProperties = {
  color: "#7be8ff",
  textDecoration: "none",
  opacity: 0.95,
  wordBreak: "break-all",
  borderLeft: "3px solid rgba(0, 240, 255, 0.35)",
  paddingLeft: 10,
  display: "block",
};
