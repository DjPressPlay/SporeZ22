// src/SavedSporez.tsx  (adjust the import path if this file isn't inside /src)
// src/SavedSporez.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Row = { short_code: string; target_url: string; created_at?: string | null };

const SITE_BASE =
  (import.meta as any).env?.VITE_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");

export default function SavedSporez() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const sessionId = typeof window !== "undefined" ? sessionStorage.getItem("session_id") : null;

      let q = supabase
        .from("profiles")
        .select("short_code, target_url, created_at")
        .eq("type", "short_link")
        .order("created_at", { ascending: false }) // newest first
        .limit(6); // only 6

      if (sessionId) q = q.eq("session_id", sessionId);

      const { data, error } = await q;
      if (!error && data) {
        // extra guard: client sort (newest→oldest) and cap 6
        const sorted = data
          .slice()
          .sort(
            (a, b) =>
              (Date.parse(b.created_at || "") || 0) - (Date.parse(a.created_at || "") || 0)
          )
          .slice(0, 6);
        setRows(sorted);
      }
      setLoading(false);
    })();
  }, []);

  const copy = async (slug: string) => {
    const shortUrl = `${SITE_BASE}/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
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
            <li
              key={r.short_code}
              style={card(isNewest)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {/* glow frame */}
              <div style={glow(isNewest)} />
              {/* newest ribbon */}
              {isNewest && <span style={ribbon}>NEW</span>}

              <div style={inner}>
                {/* Short link = primary CTA */}
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
                  <button onClick={() => copy(r.short_code)} style={copyBtn}>
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

/* ---------- styles ---------- */

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
  gap: 16,
};

const card = (isNewest: boolean): React.CSSProperties => ({
  position: "relative",
  borderRadius: 16,
  overflow: "hidden",
  background: "linear-gradient(180deg, rgba(0,20,31,0.95) 0%, rgba(0,26,38,0.95) 100%)",
  border: "1px solid rgba(0, 240, 255, 0.28)",
  boxShadow: isNewest
    ? "0 20px 54px rgba(0, 240, 255, 0.32), 0 2px 0 rgba(0,255,204,0.28) inset"
    : "0 12px 38px rgba(0, 240, 255, 0.18), 0 1px 0 rgba(0,255,204,0.16) inset",
  transform: "translateZ(0)",
  transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
  willChange: "transform, box-shadow",
  cursor: "pointer",
});

const glow = (isNewest: boolean): React.CSSProperties => ({
  position: "absolute",
  inset: -1,
  borderRadius: 18,
  pointerEvents: "none",
  background:
    "radial-gradient(1200px 220px at 10% -40%, rgba(0,255,204,0.28) 0%, rgba(0,255,204,0) 60%), radial-gradient(1200px 260px at 90% 140%, rgba(0,240,255,0.22) 0%, rgba(0,240,255,0) 60%)",
  boxShadow: isNewest
    ? "0 0 0 2px rgba(0,255,204,0.38) inset"
    : "0 0 0 1px rgba(0,255,204,0.28) inset",
});

const inner: React.CSSProperties = { position: "relative", padding: "16px 16px 14px" };

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
  background: "linear-gradient(90deg, rgba(0,255,204,1) 0%, rgba(0,240,255,1) 100%)",
  padding: "9px 14px",
  borderRadius: 999,
  border: "1px solid rgba(0,255,204,0.6)",
  boxShadow: "0 10px 30px rgba(0,255,204,0.28), 0 0 0 3px rgba(0,255,204,0.16) inset",
  fontWeight: 800,
  letterSpacing: "0.2px",
  wordBreak: "break-all",
};

const copyBtn: React.CSSProperties = {
  fontSize: ".86rem",
  border: "1px solid rgba(168, 250, 255, 0.45)",
  background: "linear-gradient(180deg, rgba(0, 240, 255, 0.18) 0%, rgba(0, 240, 255, 0.09) 100%)",
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
  borderLeft: "4px solid rgba(0, 240, 255, 0.4)",
  paddingLeft: 12,
  display: "block",
  lineHeight: 1.35,
};

const ribbon: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: -36,
  transform: "rotate(35deg)",
  background: "linear-gradient(90deg, rgba(0,255,204,1) 0%, rgba(0,240,255,1) 100%)",
  color: "#001a1a",
  fontWeight: 900,
  fontSize: ".70rem",
  padding: "6px 38px",
  letterSpacing: "0.7px",
  boxShadow: "0 6px 16px rgba(0, 240, 255, 0.38)",
  border: "1px solid rgba(0,255,204,0.6)",
  borderRadius: 6,
};
