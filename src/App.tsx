// src/App.tsx
import React, { useState, useEffect } from "react";
import SporeOverlay from "./SporeOverlay";

function SavedSporez() {
  const [spores, setSpores] = useState<{ slug: string; url: string; stats?: any }[]>([]);

  useEffect(() => {
    const storedSpores = localStorage.getItem("spores");
    if (storedSpores) setSpores(JSON.parse(storedSpores));
  }, []);

  if (spores.length === 0) {
    return (
      <div style={{ marginTop: "2rem", opacity: 0.5 }}>
        <p>🧬 No saved Sporez yet.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 760 }}>
      <h2 style={s.sectionTitle}>Saved Sporez</h2>
      <ul style={s.list}>
        {spores.map(({ slug, url, stats }, idx) => (
          <li key={slug} style={s.card(idx === 0)}>
            <div style={s.glow(idx === 0)} />
            {/* Destination URL */}
            <div style={s.destWrap}>
              <strong>URL:</strong>{" "}
              <a href={url} target="_blank" rel="noopener noreferrer" style={s.destLink}>
                {url}
              </a>
            </div>
            {/* Short link pill */}
            <div style={s.shortWrap}>
              <strong style={{ color: "#9fefff" }}>Short Link:</strong>{" "}
              <a
                href={`${window.location.origin}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={s.pill}
              >
                {window.location.origin}/{slug}
              </a>
            </div>
            {stats && (
              <div style={s.meta}>
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
  const [activeTab, setActiveTab] = useState("Home");
  const [inputValue, setInputValue] = useState("");
  const [showSporeOverlay, setShowSporeOverlay] = useState(false);

  const handleShorten = async () => {
    if (inputValue.trim() === "") return;
    setShowSporeOverlay(true);

    try {
      const res = await fetch("/.netlify/functions/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputValue }),
      });

      const data = await res.json();
      setShowSporeOverlay(false);

      if (data.shortenedUrl) {
        const slug = data.shortenedUrl.split("/").pop() || "";
        const spores = JSON.parse(localStorage.getItem("spores") || "[]");

        const stats = {
          xp: 240 + spores.length * 10,
          drops: spores.length + 1,
          fused: 1,
        };

        const newSpore = { slug, url: inputValue, stats };
        spores.push(newSpore); // (kept your logic)

        localStorage.setItem("spores", JSON.stringify(spores));

        try {
          await navigator.clipboard.writeText(data.shortenedUrl);
        } catch {}
        alert(`Spore Dropped!\nCopied to clipboard:\n${data.shortenedUrl}`);
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
    <div style={s.appShell}>
      {/* background + grid (behind everything) */}
      <div style={s.bg} />
      <div style={s.grid} />

      {/* Top bar */}
      <header style={s.topbar}>
        <div style={s.brand}>
          <span style={s.brandIcon}>🧬</span>
          <span>SporeZ</span>
        </div>
        <h1 style={s.title}>E.I.G. // Shortlink Engine</h1>
      </header>

      {/* Tabs */}
      <nav style={s.nav}>
        {["Home", "Saved Sporez", "Spore Fusion"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...s.tabBtn,
              color: activeTab === tab ? "#00ffc2" : "#00e0ff",
              textShadow: activeTab === tab ? "0 0 10px rgba(0,255,194,.35)" : "0 0 6px rgba(0,224,255,.35)",
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main style={s.main}>
        {activeTab === "Home" && (
          <>
            <h2 style={{ opacity: 0.55, marginTop: 6 }}>Welcome to the SporeZ Engine</h2>
            <p style={{ opacity: 0.35, marginTop: 0 }}>Paste a link below to generate a compact Spore link.</p>

            <div style={{ marginTop: "1.6rem", width: "100%", maxWidth: 520 }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste a long link..."
                style={s.input}
              />
              <button onClick={handleShorten} style={s.cta}>
                Shorten & Drop
              </button>
            </div>
          </>
        )}

        {activeTab === "Saved Sporez" && <SavedSporez />}

        {activeTab === "Spore Fusion" && (
          <p style={{ opacity: 0.5 }}>🔬 Fusion lab coming soon. Mix identity + payloads.</p>
        )}
      </main>

      {showSporeOverlay && <SporeOverlay />}
    </div>
  );
}

/* ================== STYLE OBJECTS (App.tsx only) ================== */
const s = {
  appShell: {
    minHeight: "100vh",
    color: "#00e0ff",
    fontFamily: "monospace, monospace",
    display: "flex",
    flexDirection: "column" as const,
    position: "relative" as const,
    overflowX: "hidden" as const,
    background: "#000a12",
  },

  bg: {
    position: "fixed" as const,
    inset: 0,
    zIndex: -2,
    background:
      "radial-gradient(900px 600px at 50% 28%, rgba(0,224,255,.10), transparent 60%)," +
      "radial-gradient(600px 420px at 22% 8%, rgba(0,255,194,.08), transparent 55%)," +
      "#000a12",
  },

  grid: {
    position: "fixed" as const,
    inset: 0,
    zIndex: -1,
    pointerEvents: "none" as const,
    background:
      "repeating-linear-gradient(0deg, transparent 0 39px, rgba(0,224,255,.06) 39px 40px)," +
      "repeating-linear-gradient(90deg, transparent 0 39px, rgba(0,224,255,.06) 39px 40px)",
  },

  topbar: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    height: 56,
    padding: "0 14px 0 10px",
    background: "#070a0e",
    borderBottom: "1px solid #0f2730",
    boxShadow: "0 2px 0 rgba(0,224,255,.08)",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#0b1f26",
    border: "1px solid rgba(0,224,255,.25)",
    color: "#00e0ff",
    fontWeight: 800,
    padding: "6px 10px",
    borderRadius: 999,
    boxShadow: "0 0 0 3px rgba(0,224,255,.06) inset",
  },

  brandIcon: {
    width: 20,
    height: 20,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #00ffc2, #00e0ff)",
    color: "#011",
    fontWeight: 900,
    borderRadius: 6,
    border: "1px solid rgba(0,0,0,.35)",
  },

  title: {
    margin: 0,
    paddingLeft: 12,
    color: "#79f2ff",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: 0.4,
  },

  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    padding: "1rem",
    borderBottom: "1px solid #0c2430",
    background: "rgba(10,24,32,.65)",
    backdropFilter: "blur(6px)",
  },

  tabBtn: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },

  main: {
    flexGrow: 1,
    padding: "2rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },

  input: {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: 12,
    border: "1px solid rgba(0,224,255,.35)",
    background: "linear-gradient(180deg, #05131b 0%, #071922 100%)",
    color: "#9fefff",
    outline: "none",
    boxShadow: "inset 0 0 0 1px rgba(0,255,194,.06)",
  },

  cta: {
    marginTop: "1rem",
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #00ffc2, #00e0ff)",
    color: "#001214",
    border: "1px solid rgba(0,255,194,.55)",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,255,194,.25), inset 0 0 0 3px rgba(0,255,194,.14)",
  },

  /* Saved list styles */
  sectionTitle: {
    margin: "0 0 14px 0",
    fontSize: "1.2rem",
    color: "#bffcff",
    letterSpacing: "0.4px",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: 16,
  },

  card: (isNewest: boolean) =>
    ({
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      background: "linear-gradient(180deg,#05131b 0%, #071922 100%)",
      border: "1px solid rgba(0,224,255,.22)",
      padding: 16,
      boxShadow: isNewest
        ? "0 18px 48px rgba(0,224,255,.22), inset 0 0 0 1px rgba(0,255,194,.08)"
        : "0 12px 36px rgba(0,224,255,.16), inset 0 0 0 1px rgba(0,255,194,.06)",
      transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
    } as React.CSSProperties),

  glow: (isNewest: boolean) =>
    ({
      position: "absolute",
      inset: -1,
      borderRadius: 18,
      pointerEvents: "none",
      background:
        "radial-gradient(1200px 220px at 10% -40%, rgba(0,255,204,0.25) 0%, rgba(0,255,204,0) 60%), radial-gradient(1200px 260px at 90% 140%, rgba(0,240,255,0.20) 0%, rgba(0,240,255,0) 60%)",
      boxShadow: isNewest
        ? "0 0 0 2px rgba(0,255,204,0.32) inset"
        : "0 0 0 1px rgba(0,255,204,0.22) inset",
    } as React.CSSProperties),

  destWrap: {
    color: "#7be8ff",
    wordBreak: "break-word" as const,
    marginBottom: 8,
  },

  destLink: {
    color: "#7be8ff",
    textDecoration: "none",
  },

  shortWrap: {
    fontSize: ".9rem",
    color: "#9fefff",
    marginTop: 6,
  },

  pill: {
    display: "inline-block",
    fontWeight: 800,
    letterSpacing: ".2px",
    color: "#001214",
    textDecoration: "none",
    background: "linear-gradient(90deg, #00ffc2, #00e0ff)",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(0,255,194,.55)",
    boxShadow: "0 8px 28px rgba(0,255,194,.25), inset 0 0 0 3px rgba(0,255,194,.14)",
    wordBreak: "break-all" as const,
    marginLeft: 8,
  },

  meta: {
    fontSize: ".76rem",
    marginTop: 6,
    color: "rgba(0,224,255,.75)",
  },
};
