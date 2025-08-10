// src/SavedSporez.tsx  (adjust the import path if this file isn't inside /src)
// src/SavedSporez.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Row = { short_code: string; target_url: string; created_at?: string | null };

const SITE_BASE =
  (import.meta as any).env?.VITE_PUBLIC_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export default function SavedSporez() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 1) Guarantee a session_id
      let sid = sessionStorage.getItem("session_id");
      if (!sid) {
        // generate once and persist (simple uid)
        sid = crypto?.randomUUID?.() || String(Date.now());
        sessionStorage.setItem("session_id", sid);
      }

      // 2) Only pull this session’s links (newest first, max 6)
      const { data, error } = await supabase
        .from("profiles")
        .select("short_code, target_url, created_at")
        .eq("type", "short_link")
        .eq("session_id", sid)                 // <-- hard session scope
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) setRows(data);
      setLoading(false);
    })();

    // 3) Ensure we don't accidentally use any old local list
    localStorage.removeItem("spores");
  }, []);

  const copy = async (slug: string) => {
    const shortUrl = `${SITE_BASE}/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(slug);
      setTimeout(() => setCopied(null), 1000);
    } catch {}
  };

  if (loading) return <p style={{ opacity: 0.6 }}>Loading…</p>;
  if (rows.length === 0) return <p style={{ opacity: 0.5 }}>🧬 No saved Sporez yet.</p>;

  return (
    <div style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 14px 0", fontSize: "1.25rem", color: "#bffcff" }}>
        Saved Sporez
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
        {rows.map((r, idx) => {
          const shortHref = `${SITE_BASE}/${r.short_code}`;
          const isNewest = idx === 0;
          return (
            <li
              key={r.short_code}
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(0,20,31,0.95) 0%, rgba(0,26,38,0.95) 100%)",
                border: "1px solid rgba(0, 240, 255, 0.28)",
                boxShadow: isNewest
                  ? "0 20px 54px rgba(0, 240, 255, 0.32), 0 2px 0 rgba(0,255,204,0.28) inset"
                  : "0 12px 38px rgba(0, 240, 255, 0.18), 0 1px 0 rgba(0,255,204,0.16) inset",
                transition:
                  "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* glow frame */}
              <div
                style={{
                  position: "absolute",
                  inset: -1,
                  borderRadius: 18,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(1200px 220px at 10% -40%, rgba(0,255,204,0.28) 0%, rgba(0,255,204,0) 60%), radial-gradient(1200px 260px at 90% 140%, rgba(0,240,255,0.22) 0%, rgba(0,240,255,0) 60%)",
                  boxShadow: isNewest
                    ? "0 0 0 2px rgba(0,255,204,0.38) inset"
                    : "0 0 0 1px rgba(0,255,204,0.28) inset",
                }}
              />
              {/* newest ribbon */}
              {isNewest && (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: -36,
                    transform: "rotate(35deg)",
                    background:
                      "linear-gradient(90deg, rgba(0,255,204,1) 0%, rgba(0,240,255,1) 100%)",
                    color: "#001a1a",
                    fontWeight: 900,
                    fontSize: ".70rem",
                    padding: "6px 38px",
                    letterSpacing: "0.7px",
                    boxShadow: "0 6px 16px rgba(0, 240, 255, 0.38)",
                    border: "1px solid rgba(0,255,204,0.6)",
                    borderRadius: 6,
                  }}
                >
                  NEW
                </span>
              )}

              <div style={{ position: "relative", padding: "16px 16px 14px" }}>
                {/* short link */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                  <a
                    href={shortHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      fontSize: "1.06rem",
                      color: "#001a1a",
                      textDecoration: "none",
                      background:
                        "linear-gradient(90deg, rgba(0,255,204,1) 0%, rgba(0,240,255,1) 100%)",
                      padding: "9px 14px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,255,204,0.6)",
                      boxShadow:
                        "0 10px 30px rgba(0,255,204,0.28), 0 0 0 3px rgba(0,255,204,0.16) inset",
                      fontWeight: 800,
                      letterSpacing: "0.2px",
                      wordBreak: "break-all",
                    }}
                  >
                    {shortHref}
                  </a>
                  <button
                    onClick={() => copy(r.short_code)}
                    style={{
                      fontSize: ".86rem",
                      border: "1px solid rgba(168, 250, 255, 0.45)",
                      background:
                        "linear-gradient(180deg, rgba(0, 240, 255, 0.18) 0%, rgba(0, 240, 255, 0.09) 100%)",
                      color: "#a8faff",
                      padding: "8px 12px",
                      borderRadius: 10,
                      cursor: "pointer",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {copied === r.short_code ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* destination */}
                <a
                  href={r.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#8cf2ff",
                    textDecoration: "none",
                    opacity: 0.96,
                    wordBreak: "break-all",
                    borderLeft: "4px solid rgba(0, 240, 255, 0.4)",
                    paddingLeft: 12,
                    display: "block",
                    lineHeight: 1.35,
                  }}
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
