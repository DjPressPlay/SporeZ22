// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import SporeOverlay from "./SporeOverlay";
import { supabase } from "../supabaseClient";

type SporeRow = { short_code: string; target_url: string; created_at?: string | null };

const SITE_BASE =
  (import.meta as any).env?.VITE_PUBLIC_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

function ensureSessionId(): string {
  let sid = typeof window !== "undefined" ? sessionStorage.getItem("session_id") : "";
  if (!sid) {
    // simple uid
    sid = (crypto as any)?.randomUUID?.() || String(Date.now());
    sessionStorage.setItem("session_id", sid);
  }
  return sid;
}

/* ---------------- SavedSporez (Supabase only) ---------------- */

function SavedSporez({ refreshKey, sid }: { refreshKey: number; sid: string }) {
  const [rows, setRows] = useState<SporeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("short_code, target_url, created_at")
        .eq("type", "short_link")
        .eq("session_id", sid)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) setRows(data);
      setLoading(false);
    })();
  }, [refreshKey, sid]);

  const copy = async (slug: string) => {
    const shortUrl = `${SITE_BASE}/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(slug);
      setTimeout(() => setCopied(null), 1100);
    } catch {}
  };

  if (loading) return <p style={{ opacity: 0.6 }}>Loading…</p>;
  if (!rows.length) return <p style={{ opacity: 0.5 }}>🧬 No saved Sporez yet.</p>;

  return (
    <div style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 14px 0", fontSize: "1.25rem", color: "#bffcff" }}>Saved Sporez</h2>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
        }}
      >
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
                transform: "translateZ(0)",
                transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
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

/* ---------------- App ---------------- */

export default function App() {
  const [activeTab, setActiveTab] = useState<"Home" | "Saved Sporez" | "Spore Fusion">("Home");
  const [inputValue, setInputValue] = useState("");
  const [showSporeOverlay, setShowSporeOverlay] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const sid = useMemo(() => ensureSessionId(), []);

  const handleShorten = async () => {
    const url = inputValue.trim();
    if (!url) return;

    setShowSporeOverlay(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, sessionId: sid }),
      });

      const data = await res.json();
      setShowSporeOverlay(false);

      if (data?.shortenedUrl) {
        try {
          await navigator.clipboard.writeText(data.shortenedUrl);
        } catch {}
        // Refresh the saved list
        setRefreshKey((x) => x + 1);
        setActiveTab("Saved Sporez");
        setInputValue("");
      } else {
        alert("Error: Could not generate Spore link.");
      }
    } catch (err) {
      setShowSporeOverlay(false);
      alert("Failed to contact the Spore shortening service.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #00040f, #00111a)",
        color: "#00f0ff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid #00f0ff33",
          background: "#000a12",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #00f0ff88",
            boxShadow: "0 0 12px #00f0ff55",
            background: "#001a26",
          }}
        >
          <img
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExanhzZzZnM2VrdnY2b3Z4Zmt2ZWNxOGEzZWIxdTV3Zmp1YXc1dDFzOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DCqjTqTnUBOSAK1WfH/giphy.gif"
            alt="Spore Logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            background: "linear-gradient(to right, #00f0ff, #00ff88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            textAlign: "left",
          }}
        >
          SporeZ // E.I.G.
        </h1>
      </header>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          padding: "1rem",
          borderBottom: "1px solid #00f0ff22",
          background: "#001923",
        }}
      >
        {(["Home", "Saved Sporez", "Spore Fusion"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              color: activeTab === tab ? "#00ff88" : "#00f0ff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              textShadow: "0 0 6px #00f0ff66",
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main
        style={{
          flexGrow: 1,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {activeTab === "Home" && (
          <>
            <h2 style={{ opacity: 0.5 }}>Welcome to the SporeZ Engine</h2>
            <p style={{ opacity: 0.3 }}>Paste a link below to generate a compact Spore link.</p>

            <div style={{ marginTop: "2rem", width: "100%", maxWidth: 500 }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste a long link..."
                style={{
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #00f0ff88",
                  background: "#001a26",
                  color: "#00f0ff",
                  outline: "none",
                }}
              />
              <button
                onClick={handleShorten}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  background: "#00f0ff",
                  color: "#000",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 0 10px #00f0ff88",
                }}
              >
                Shorten & Drop
              </button>
            </div>
          </>
        )}

        {activeTab === "Saved Sporez" && <SavedSporez refreshKey={refreshKey} sid={sid} />}

        {activeTab === "Spore Fusion" && (
          <p style={{ opacity: 0.5 }}>🔬 Fusion lab coming soon. Mix identity + payloads.</p>
        )}
      </main>

      {showSporeOverlay && <SporeOverlay />}
    </div>
  );
}
