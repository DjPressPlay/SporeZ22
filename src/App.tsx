// src/App.tsx
// src/App.tsx
import React, { useEffect, useState } from "react";
import SporeOverlay from "./SporeOverlay";

type Spore = { slug: string; url: string; stats?: any; ts: number };
type Tab = "Home" | "Saved Sporez" | "Spore Fusion";

/** Global: BLACK scrollbar (ChatGPT-style) */
function ScrollbarStyles() {
  return (
    <style>{`
      :root {
        --scroll-thumb: #000;         /* pure black */
        --scroll-thumb-hover: #000;   /* stay black on hover */
        --scroll-track: transparent;
        --blk: #000;                  /* black line */
      }
      /* Firefox */
      * { scrollbar-width: thin; scrollbar-color: var(--scroll-thumb) var(--scroll-track); }
      /* Chrome / Edge / Safari */
      *::-webkit-scrollbar { width: 10px; height: 10px; }
      *::-webkit-scrollbar-track { background: var(--scroll-track); }
      *::-webkit-scrollbar-thumb { background-color: var(--scroll-thumb); border-radius: 8px; border: 2px solid #000; }
      *::-webkit-scrollbar-thumb:hover { background-color: var(--scroll-thumb-hover); }
      html { scrollbar-gutter: stable both-edges; }
    `}</style>
  );
}

/** Global: BLACK outline utilities for all boxes/containers */
function BlackLineStyles() {
  return (
    <style>{`
      .blk        { border: 1px solid var(--blk); }
      .blk-thick  { border: 2px solid var(--blk); }
      .blk-inset  { box-shadow: inset 0 0 0 1px var(--blk); }
      .blk-soft   { box-shadow: 0 0 0 1px var(--blk); }
      /* Optional: rounded helper to avoid repeating radius inline */
      .r14        { border-radius: 14px; }
      .r10        { border-radius: 10px; }
    `}</style>
  );
}

function ensureSessionId(): string {
  let sid = "";
  if (typeof window !== "undefined") {
    sid = sessionStorage.getItem("session_id") || "";
    if (!sid) {
      sid = String(Date.now());
      sessionStorage.setItem("session_id", sid);
    }
  }
  return sid;
}

function SavedSporez() {
  const [spores, setSpores] = useState<Spore[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("spores");
    const list: Spore[] = stored ? JSON.parse(stored) : [];
    list.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    setSpores(list.slice(0, 6));
  }, []);

  if (spores.length === 0) {
    return (
      <div className="blk r10" style={{ marginTop: "2rem", opacity: 0.5, padding: "1rem" }}>
        <p>🧬 No saved Sporez yet.</p>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="blk r10" style={{ width: "100%", maxWidth: 720, padding: "1rem" }}>
      <h2
        className="blk-inset r10"
        style={{
          fontSize: "1.4rem",
          color: "#00f0ff",
          marginBottom: "1rem",
          borderBottom: "1px solid #00f0ff55",
          padding: "0.75rem 0.75rem",
          background: "#000a12",
        }}
      >
        Saved Sporez:
      </h2>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 16,
        }}
      >
        {spores.map(({ slug, url, stats }, idx) => (
          <li
            key={slug}
            className="blk r14"
            style={{
              position: "relative",
              margin: 0,
              background: "linear-gradient(180deg, #00141f 0%, #001a26 100%)",
              padding: "1rem",
              boxShadow:
                idx === 0
                  ? "0 18px 48px rgba(0,240,255,0.28), inset 0 0 0 1px rgba(0,255,204,0.10)"
                  : "0 12px 28px rgba(0,240,255,0.18), inset 0 0 0 1px rgba(0,255,204,0.08)",
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              className="blk-inset r10"
              style={{
                color: "#00ff88",
                wordBreak: "break-word",
                marginBottom: "0.6rem",
                padding: "0.5rem 0.6rem",
                background: "#00151c",
              }}
            >
              <strong>URL:</strong>{" "}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00ff88" }}
              >
                {url}
              </a>
            </div>

            <div className="blk-inset r10" style={{ fontSize: "0.9rem", color: "#00f0ffcc", padding: "0.5rem 0.6rem", background: "#00151c" }}>
              <strong>Short Link:</strong>{" "}
              <a
                href={`${origin}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blk r10"
                style={{
                  display: "inline-block",
                  color: "#001a1a",
                  background:
                    "linear-gradient(90deg, rgba(0,255,204,1) 0%, rgba(0,240,255,1) 100%)",
                  padding: "6px 10px",
                  textDecoration: "none",
                }}
              >
                {origin}/{slug}
              </a>
            </div>

            {stats && (
              <div
                className="blk-inset r10"
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.4rem",
                  color: "#00f0ff99",
                  padding: "0.4rem 0.6rem",
                  background: "#00151c",
                }}
              >
                XP: {stats?.xp ?? 0} • Drops: {stats?.drops ?? 0} • Fused: {stats?.fused ?? 0}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [inputValue, setInputValue] = useState("");
  const [showSporeOverlay, setShowSporeOverlay] = useState(false);

  const handleShorten = async () => {
    const url = inputValue.trim();
    if (!url) return;

    setShowSporeOverlay(true);
    try {
      const sessionId = ensureSessionId();

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, sessionId }),
      });

      const data = await res.json().catch(() => ({}));
      setShowSporeOverlay(false);

      if (res.ok && data?.shortenedUrl) {
        const slug: string =
          (data.short_code as string) ||
          (String(data.shortenedUrl).split("/").pop() as string) ||
          "";

        const prev: Spore[] = JSON.parse(localStorage.getItem("spores") || "[]");
        const stats = { xp: 240 + prev.length * 10, drops: prev.length + 1, fused: 1 };
        const newSpore: Spore = { slug, url, stats, ts: Date.now() };
        const updated = [newSpore, ...prev].slice(0, 6);
        localStorage.setItem("spores", JSON.stringify(updated));

        try {
          await navigator.clipboard.writeText(data.shortenedUrl);
        } catch {}

        alert(`Spore Dropped!\nCopied to clipboard:\n${data.shortenedUrl}`);
        setInputValue("");
        setActiveTab("Saved Sporez");
      } else {
        alert("Error: Could not generate Spore link.");
      }
    } catch {
      setShowSporeOverlay(false);
      alert("Failed to contact the Spore shortening service.");
    }
  };

  const TABS: Tab[] = ["Home", "Saved Sporez", "Spore Fusion"];

  return (
    <div
      className="blk-inset"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #00040f, #00111a)",
        color: "#00f0ff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <ScrollbarStyles />
      <BlackLineStyles />

      {/* Background glow */}
      <div
        className="blk-inset"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background:
            "radial-gradient(900px 600px at 50% 28%, rgba(0,224,255,.10), transparent 60%)," +
            "radial-gradient(600px 420px at 22% 8%, rgba(0,255,194,.08), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Checkered grid */}
      <div
        className="blk-inset"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "repeating-linear-gradient(0deg, transparent 0 39px, rgba(0,224,255,.06) 39px 40px)," +
            "repeating-linear-gradient(90deg, transparent 0 39px, rgba(0,224,255,.06) 39px 40px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        className="blk r10"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid #00f0ff33",
          background: "#000a12",
          gap: "1rem",
          margin: "0.75rem",
        }}
      >
        <div
          className="blk r10"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            overflow: "hidden",
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
          className="blk-inset r10"
          style={{
            fontSize: "1.5rem",
            background: "linear-gradient(to right, #00f0ff, #00ff88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            textAlign: "left",
            padding: "0.5rem 0.75rem",
          }}
        >
          SporeZ // E.I.G.
        </h1>
      </header>

      {/* Nav */}
      <nav
        className="blk r10"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          padding: "1rem",
          borderBottom: "1px solid #00f0ff22",
          background: "#001923",
          margin: "0 0.75rem",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            className="blk r10"
            onClick={() => setActiveTab(tab)}
            style={{
              background: "linear-gradient(180deg, #00141f, #001a26)",
              color: activeTab === tab ? "#00ff88" : "#00f0ff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              textShadow: "0 0 6px #00f0ff66",
              padding: "0.5rem 0.9rem",
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main
        className="blk r10"
        style={{
          flexGrow: 1,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0.75rem",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        {activeTab === "Home" && (
          <div className="blk r10" style={{ width: "100%", maxWidth: 560, padding: "1.25rem" }}>
            <h2 className="blk-inset r10" style={{ opacity: 0.6, padding: "0.5rem 0.75rem", margin: 0 }}>
              Welcome to the SporeZ Engine
            </h2>
            <p className="blk-inset r10" style={{ opacity: 0.4, marginTop: "0.75rem", padding: "0.5rem 0.75rem" }}>
              Paste a link below to generate a compact Spore link.
            </p>

            <div className="blk r10" style={{ marginTop: "1rem", padding: "1rem", background: "#000a12" }}>
              <input
                className="blk r10"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste a long link..."
                style={{
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1rem",
                  background: "#001a26",
                  color: "#00f0ff",
                  outline: "none",
                }}
              />
              <button
                className="blk-thick r10"
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
                  cursor: "pointer",
                  boxShadow: "0 0 10px #00f0ff88",
                }}
              >
                Shorten & Drop
              </button>
            </div>
          </div>
        )}

        {activeTab === "Saved Sporez" && <SavedSporez />}

        {activeTab === "Spore Fusion" && (
          <p className="blk-inset r10" style={{ opacity: 0.5, padding: "0.75rem 1rem" }}>
            🔬 Fusion lab coming soon. Mix identity + payloads.
          </p>
        )}
      </main>

      {showSporeOverlay && <SporeOverlay />}
    </div>
  );
}
