// src/App.tsx
import React, { useEffect, useState } from "react";
import SporeOverlay from "./SporeOverlay";

type Spore = { slug: string; url: string; stats?: any; ts: number };
type Tab = "Home" | "Saved Sporez";

/** PURE BLACK scrollbar */
function ScrollbarStyles() {
  return (
    <style>{`
      :root { --scroll-thumb:#000; --scroll-thumb-hover:#000; --scroll-track:transparent; --blk:#000; }
      *{ scrollbar-width:thin; scrollbar-color:var(--scroll-thumb) var(--scroll-track); }
      *::-webkit-scrollbar{ width:10px; height:10px; }
      *::-webkit-scrollbar-track{ background:var(--scroll-track); }
      *::-webkit-scrollbar-thumb{ background-color:var(--scroll-thumb); border-radius:8px; border:2px solid #000; }
      *::-webkit-scrollbar-thumb:hover{ background-color:var(--scroll-thumb-hover); }
      html{ scrollbar-gutter:stable both-edges; }
    `}</style>
  );
}

/** BLACK outlines */
function BlackLineStyles() {
  return (
    <style>{`
      .blk{ border:1px solid var(--blk); }
      .blk-thick{ border:2px solid var(--blk); }
      .blk-inset{ box-shadow: inset 0 0 0 1px var(--blk); }
      .blk-soft{ box-shadow: 0 0 0 1px var(--blk); }
      .r14{ border-radius:14px; }
      .r10{ border-radius:10px; }
    `}</style>
  );
}

/** Neon palette */
function NeonStyles() {
  return (
    <style>{`
      :root{
        --n-purple:#9b5cff; --n-cyan:#00e7ff; --n-blue:#00a2ff; --n-green:#00ff85; --n-pink:#ff2fd1; --n-rose:#ff3cac;
        --txt:#cfe6ff;
        --glow-purp:rgba(155,92,255,.26); --glow-cyan:rgba(0,231,255,.22); --glow-grn:rgba(0,255,133,.20); --glow-pink:rgba(255,47,209,.24);
        --grid-a:rgba(155,92,255,.08); --grid-b:rgba(0,231,255,.06);
      }
      @keyframes neonShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes sheen{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .txt-neon{
        background-image:linear-gradient(90deg,var(--n-rose),var(--n-purple),var(--n-cyan));
        -webkit-background-clip:text;background-clip:text;color:transparent;
      }
      .btn-neon{
        position:relative;color:#001316;background-image:linear-gradient(90deg,var(--n-green),var(--n-cyan),var(--n-rose),var(--n-purple));
        background-size:300% 300%;animation:neonShift 8s linear infinite;
      }
      .btn-neon::after{
        content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,.18),transparent);
        background-size:200% 100%;animation:sheen 2.8s linear infinite;mix-blend-mode:screen;border-radius:inherit;pointer-events:none;
      }
      .rule-neon{ border-bottom:1px solid rgba(255,47,209,.45); }
    `}</style>
  );
}

/** Center EVERYTHING (including inputs & placeholders) */
function CenterStyles() {
  return (
    <style>{`
      .centered, .centered * { text-align: center !important; }
      .centered input, .centered textarea { text-align: center !important; }
      .centered input::placeholder, .centered textarea::placeholder { text-align: center; }
    `}</style>
  );
}

/** Iridescent ring + 3D panel/gloss */
function HoloRingStyles() {
  return (
    <style>{`
      .holo-ring{
        position:relative;border:1px solid transparent;border-radius:16px;
        background:
          linear-gradient(#fff,#fff) padding-box,
          conic-gradient(from 0deg,
            var(--n-purple), var(--n-cyan), var(--n-rose), var(--n-green), var(--n-blue), var(--n-pink), var(--n-purple)
          ) border-box;
        background-size:200% 200%, 300% 300%;
        animation: neonShift 12s ease-in-out infinite;
        box-shadow:
          0 0 0 1px rgba(0,0,0,.9) inset,
          0 18px 60px rgba(0,0,0,.45),
          0 10px 28px var(--glow-purp),
          0 14px 38px var(--glow-pink);
        border-radius:16px;
      }
      .holo-ring::after{
        content:"";position:absolute;inset:-18px;border-radius:inherit;z-index:-1;
        background:
          radial-gradient(closest-side, rgba(155,92,255,.25), transparent 70%),
          radial-gradient(closest-side, rgba(0,231,255,.22), transparent 72%),
          radial-gradient(closest-side, rgba(255,47,209,.18), transparent 74%);
        filter:blur(24px);
      }
      .panel-3d{
        position:relative;background:#fff;border-radius:16px;
        box-shadow:0 28px 70px rgba(0,0,0,.48),0 6px 18px rgba(0,0,0,.35),inset 0 0 0 1px #000;
      }
      .panel-3d::before{
        content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
        background:
          linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0) 45%),
          radial-gradient(120% 60% at 0% 0%, rgba(255,255,255,.35), transparent 60%);
        mix-blend-mode:screen;opacity:.9;
      }
    `}</style>
  );
}

function ensureSessionId(): string {
  let sid = "";
  if (typeof window !== "undefined") {
    sid = sessionStorage.getItem("session_id") || "";
    if (!sid) { sid = String(Date.now()); sessionStorage.setItem("session_id", sid); }
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
      <div className="blk r10" style={{ marginTop: "2rem", opacity: 0.6, padding: "1rem", color: "var(--txt)" }}>
        <p>🧬 No saved Sporez yet.</p>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="blk r10" style={{ width: "100%", maxWidth: 720, padding: "1rem", color: "var(--txt)" }}>
      <h2
        className="blk-inset r10 rule-neon"
        style={{ fontSize: "1.4rem", marginBottom: "1rem", padding: "0.75rem 0.75rem", background: "#0a0016" }}
      >
        <span className="txt-neon">Saved Sporez:</span>
      </h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
        {spores.map(({ slug, url, stats }, idx) => (
          <li
            key={slug}
            className="blk r14"
            style={{
              position: "relative",
              margin: 0,
              background: "linear-gradient(180deg, #070015 0%, #00111a 100%)",
              padding: "1rem",
              boxShadow:
                idx === 0
                  ? `0 18px 48px var(--glow-pink), 0 0 0 1px var(--glow-cyan) inset`
                  : `0 14px 32px var(--glow-purp), 0 0 0 1px var(--glow-grn) inset`,
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div
              className="blk-inset r10"
              style={{
                color: "var(--n-green)",
                wordBreak: "break-word",
                marginBottom: "0.6rem",
                padding: "0.5rem 0.6rem",
                background: "#0a0b1a",
                textShadow: "0 0 8px var(--glow-grn)",
              }}
            >
              <strong>URL:</strong>{" "}
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--n-green)" }}>
                {url}
              </a>
            </div>

            <div className="blk-inset r10" style={{ fontSize: "0.9rem", color: "var(--txt)", padding: "0.5rem 0.6rem", background: "#0a0b1a" }}>
              <strong style={{ color: "var(--n-cyan)" }}>Short Link:</strong>{" "}
              <a
                href={`${origin}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blk r10 btn-neon"
                style={{ display: "inline-block", padding: "6px 10px", textDecoration: "none", boxShadow: "0 0 22px var(--glow-pink)" }}
              >
                {origin}/{slug}
              </a>
            </div>

            {stats && (
              <div className="blk-inset r10" style={{ fontSize: "0.75rem", marginTop: "0.4rem", color: "var(--txt)", padding: "0.4rem 0.6rem", background: "#0a0b1a" }}>
                <span style={{ color: "var(--n-purple)" }}>XP:</span> {stats?.xp ?? 0} •{" "}
                <span style={{ color: "var(--n-rose)" }}>Drops:</span> {stats?.drops ?? 0} •{" "}
                <span style={{ color: "var(--n-cyan)" }}>Fused:</span> {stats?.fused ?? 0}
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
        const slug: string = (data.short_code as string) || (String(data.shortenedUrl).split("/").pop() as string) || "";
        const prev: Spore[] = JSON.parse(localStorage.getItem("spores") || "[]");
        const stats = { xp: 240 + prev.length * 10, drops: prev.length + 1, fused: 1 };
        const newSpore: Spore = { slug, url, stats, ts: Date.now() };
        const updated = [newSpore, ...prev].slice(0, 6);
        localStorage.setItem("spores", JSON.stringify(updated));
        try { await navigator.clipboard.writeText(data.shortenedUrl); } catch {}
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

  const NAV: Array<{ kind: "tab" | "link"; label: string; href?: string }> = [
    { kind: "tab", label: "Home" },
    { kind: "tab", label: "Saved Sporez" },
    { kind: "link", label: "Spore Fusion", href: "https://jessicaspz.netlify.app/" },
  ];

  return (
    <div
      className="blk-inset centered"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020109 0%, #070015 60%, #001018 100%)",
        color: "var(--txt)",
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
      <NeonStyles />
      <CenterStyles />
      <HoloRingStyles />

      {/* Background glow fields */}
      <div
        className="blk-inset"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background:
            `radial-gradient(900px 600px at 18% 22%, var(--glow-purp), transparent 60%),` +
            `radial-gradient(800px 520px at 80% 18%, var(--glow-cyan), transparent 65%),` +
            `radial-gradient(700px 480px at 50% 78%, var(--glow-pink), transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Cyber grid */}
      <div
        className="blk-inset"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            `repeating-linear-gradient(0deg, transparent 0 39px, var(--grid-a) 39px 40px),` +
            `repeating-linear-gradient(90deg, transparent 0 39px, var(--grid-b) 39px 40px)`,
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
          borderBottom: "1px solid rgba(255, 47, 209, .35)",
          background: "#0b0017",
          gap: "1rem",
          margin: "0.75rem",
          boxShadow: "0 10px 28px var(--glow-purp)",
        }}
      >
        <div
          className="blk r10"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#00131a",
            boxShadow: "0 0 22px var(--glow-cyan)",
          }}
        >
          <img
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExanhzZzZnM2VrdnY2b3Z4Zmt2ZWNxOGEzZWIxdTV3Zmp1YXc1dDFzOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DCqjTqTnUBOSAK1WfH/giphy.gif"
            alt="Spore Logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <h1
          className="blk-inset r10 txt-neon"
          style={{ fontSize: "1.6rem", margin: 0, padding: "0.5rem 0.75rem" }}
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
    gap: "1rem",
    padding: "0.9rem",
    borderBottom: "1px solid rgba(0,231,255,.35)",
    background: "#06101a",
    margin: "0 0.75rem",
    boxShadow: "0 8px 20px var(--glow-cyan)",
  }}
>
  {TABS.map((tab) =>
    tab === "Spore Fusion" ? (
      <a
        key={tab}
        href="https://jessicaspz.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="blk r10 btn-neon"
        style={{
          color: "#001316",
          fontSize: "0.98rem",
          fontWeight: 800,
          cursor: "pointer",
          padding: "0.6rem 1.1rem",
          boxShadow: "0 0 16px var(--glow-grn)",
          opacity: 0.92,
          textDecoration: "none",
          display: "inline-block",
          textAlign: "center",
          transition: "all .18s ease",
        }}
      >
        {tab}
      </a>
    ) : (
      <button
        key={tab}
        className="blk r10 btn-neon"
        onClick={() => setActiveTab(tab)}
        style={{
          color: "#001316",
          fontSize: "0.98rem",
          fontWeight: 800,
          cursor: "pointer",
          padding: "0.6rem 1.1rem",
          boxShadow: activeTab === tab ? "0 0 24px var(--glow-pink)" : "0 0 16px var(--glow-grn)",
          opacity: activeTab === tab ? 1 : 0.92,
          transform: activeTab === tab ? "translateY(-1px)" : "none",
          transition: "all .18s ease",
        }}
      >
        {tab}
      </button>
    )
  )}
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
          background: "rgba(0,0,0,0.28)",
          boxShadow: "0 18px 40px var(--glow-purp)",
        }}
      >
        {activeTab === "Home" && (
          <div className="holo-ring" style={{ width: "100%", maxWidth: 740, margin: "0 auto" }}>
            <div className="blk r14 panel-3d" style={{ padding: 0 }}>
              <div style={{ padding: "1.25rem 1.25rem .75rem", borderBottom: "1px solid #000" }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#000" }}>Welcome to the SporeZ Engine</h2>
                <p style={{ margin: ".5rem 0 0", color: "#222" }}>
                  Paste a link below to generate a compact Spore link.
                </p>
              </div>

              <div style={{ padding: "1.25rem" }}>
                <input
                  className="blk r10"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Paste a long link..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "1rem",
                    fontSize: "1rem",
                    background: "#ffffff",
                    color: "#111",
                    outline: "none",
                  }}
                />
                <button
                  className="blk-thick r10 btn-neon"
                  onClick={handleShorten}
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1rem",
                    fontWeight: 900,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Shorten & Drop
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Saved Sporez" && <SavedSporez />}
      </main>

      {showSporeOverlay && <SporeOverlay />}
    </div>
  );
}
