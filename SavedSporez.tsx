// src/SavedSporez.tsx  (adjust the import path if this file isn't inside /src)
// src/SavedSporez.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Row = { short_code: string; target_url: string; created_at?: string };

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
        .order("created_at", { ascending: false }) // NEWEST FIRST from DB
        .limit(6); // ONLY 6

      if (sessionId) q = q.eq("session_id", sessionId);

      const { data, error } = await q;

      // Fallback: sort client-side too (guards against any DB/order weirdness)
      const sorted =
        (data || []).sort((a, b) => {
          const ta = a.created_at ? Date.parse(a.created_at) : 0;
          const tb = b.created_at ? Date.parse(b.created_at) : 0;
          return tb - ta; // newest → oldest
        }).slice(0, 6);

      if (!error) setRows(sorted);
      setLoading(false);
    })();
  }, []);

  const copy = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`${SITE_BASE}/${slug}`);
      setCopied(slug);
      setTimeout(() => setCopied(null), 1100);
    } catch {}
  };

  if (loading) return <p style={{ opacity: 0.6 }}>Loading…</p>;
  if (rows.length === 0) return <p style={{ opacity: 0.5 }}>🧬 No saved Sporez yet.</p>;

  return (
    <div style={wrap}>
      <h2 style={title}>Saved Sporez</h2>
      <ul style={grid}>
        {rows.map((r, idx) => {
          const shortHref = `${SITE_BASE}/${r.short_code}`;
          const isNewest = idx === 0;
          return (
            <li key={r.short_code} style={card(isNewest)}>
              {/* Glow frame layer */}
              <div style={glow(isNewest)} />

              {/* Ribbon for newest */}
              {isNewest && <span style={ribbon}>NEW</span>}

              {/* Content */}
              <div style={inner}>
                {/* Primary CTA: short link */}
                <div style={shortRow}>
                  <a
                    href={shortHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={shortLink}
                    title="Open short link"
                  >
                    {shortHref}
                  </a>
                  <button
                    onClick={() => copy(r.short_code)}
                    style={copyBtn}
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
                  style={destLink}
                  title={r.target_url}
                >
                  {r.target_url}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ————— Styles ————— */

const wrap: React.CSSProperties = { width: "100%", maxWidth: 880, margin: "0 auto" };

const title: React.CSSProperties = {
  margin: "0 0 14px 0",
  fontSize: "1.25rem",
  color: "#bffcff",
  letterSpacing: "0.4px",
};

const grid: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
};

const card = (isNewest: boolean): React.CSSProperties => ({
  position: "relative",
  borderRadius: 16,
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(0,20,31,0.95) 0%, rgba(0,26,38,0.95) 100%)",
  border: "1px solid rgba(0, 240, 255, 0.25)",
  boxShadow: isNewest
    ? "0 18px 48px rgba(0, 240, 255, 0.28), 0 2px 0 rgba(0,255,204,0.25) inset"
    : "0 12px 36px rgba(0, 240, 255, 0.16), 0 1px 0 rgba(0,255,204,0.15) inset",
  transform: "translateZ(0)",
  transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
  willChange: "transform, box-shadow",
  cursor: "pointer",
} as React.CSSProperties);

const glow = (isNewest: boolean): React.CSSProperties => ({
  position: "absolute",
  inset: -1,
  borderRadius: 18,
  pointerEvents: "none",
  background:
    "radial-gradient(1200px 220px at 10% -40%, rgba(0,255,204,0.25) 0%, rgba(0,255,204,0) 60%), radial-gradient(1200px 260px at 90% 140%, rgba(0,240,255,0.20) 0%, rgba(0,240,255,0) 60%)",
  boxShadow: isNewest
    ? "0 0 0 2px rgba(0,255,204,0.35) inset"
    : "0 0 0 1px rgba(0,255,204,0.25) inset",
});

const inner: React.CSSProperties = {
  position: "relative",
  padding: "16px 16px 14px",
};

const shortRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 10,
  flexWrap: "wrap",
};

const shortLink: React.CSSProperties = {
  display: "inline-block",
  fontSize: "1.06rem",
  color: "#001a1a",
  textDecoration: "none",
  background:
    "linear-gradient(90deg, rgba(0,255,204,1) 0%, rgba(0,240,255,1) 100%)",
  padding: "9px 14px",
  borderRadius: 999,
  border: "1px solid rgba(0,255,204,0.55)",
  boxShadow:
    "0 8px 28px rgba(0,255,204,0.25), 0 0 0 3px rgba(0,255,204,0.15) inset",
  fontWeight: 700,
  letterSpacing: "0.2px",
  wordBreak: "break-all",
};

const copyBtn: React.CSSProperties = {
  fontSize: ".86rem",
  border: "1px solid rgba(168, 250, 255, 0.4)",
  background:
    "linear-gradient(180deg, rgba(0, 240, 255, 0.15) 0%, rgba(0, 240, 255, 0.07) 100%)",
  color: "#a8faff",
  padding: "8px 12px",
  borderRadius: 10,
  cursor: "pointer",
  backdropFilter: "blur(6px)",
};

const destLink: React.CSSProperties = {
  color: "#8cf2ff",
  textDecoration: "none",
  opacity: 0.96,
  wordBreak: "break-all",
  borderLeft: "4px solid rgba(0, 240, 255, 0.38)",
  paddingLeft: 12,
  display: "block",
  lineHeight: 1.35,
};

const ribbon: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: -36,
  transform: "rotate(35deg)",
  background:
    "linear-gradient(90deg, rgba(0,255,204,1) 0%, rgba(0,240,255,1) 100%)",
  color: "#001a1a",
  fontWeight: 800,
  fontSize: ".70rem",
  padding: "6px 38px",
  letterSpacing: "0.7px",
  boxShadow: "0 6px 14px rgba(0, 240, 255, 0.35)",
  border: "1px solid rgba(0,255,204,0.55)",
  borderRadius: 6,
};
