import React, { useState, useEffect } from "react";
import SporeOverlay from "./SporeOverlay";
import CreateProfileOverlay from "./createProfile";

function SavedSporez({ userProfile }: { userProfile: any }) {
  const [spores, setSpores] = useState<
    { slug: string; url: string; sessionId?: string; stats?: any }[]
  >([]);

  useEffect(() => {
    const storedSpores = localStorage.getItem("spores");
    if (storedSpores) {
      setSpores(JSON.parse(storedSpores));
    }
  }, [userProfile]);

  if (spores.length === 0) {
    return <p style={{ opacity: 0.5 }}>🧬 No saved Sporez yet.</p>;
  }

  return (
    <div style={{ width: "100%", maxWidth: 600 }}>
      <h2>Saved Sporez</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {spores.map(({ slug, url, sessionId, stats }) => (
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

            {sessionId && (
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.8rem",
                  color: "#00f0ffcc",
                }}
              >
                Session: <strong>{sessionId}</strong>
              </div>
            )}
            {stats && (
              <div
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.2rem",
                  color: "#00f0ff99",
                }}
              >
                XP: {stats?.xp ?? 0} • Drops: {stats?.drops ?? 0} • Fused:{" "}
                {stats?.fused ?? 0}
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
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

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

        const sessionId = userProfile?.sessionId || "UNKNOWN-Z";
        const stats = {
          xp: 240 + spores.length * 10,
          drops: spores.length + 1,
          fused: 1,
        };

        const newSpore = { slug, url: inputValue, sessionId, stats };
        spores.push(newSpore);

        localStorage.setItem("spores", JSON.stringify(spores));

        navigator.clipboard.writeText(data.shortenedUrl);
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

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      setUserProfile(JSON.parse(stored));
    }
  }, [showProfileOverlay]);

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
      {/* 🔹 Header */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid #00f0ff33",
          background: "#000a12",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
              src={
                userProfile?.avatar ||
                "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExanhzZzZnM2VrdnY2b3Z4Zmt2ZWNxOGEzZWIxdTV3Zmp1YXc1dDFzOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DCqjTqTnUBOSAK1WfH/giphy.gif"
              }
              alt="Spore Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "bold", color: "#00ffcc" }}>
              Z-Entity: {userProfile?.name || "Unknown"}
            </span>
            <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>
              XP: {userProfile?.stats?.xp ?? 0} • Drops:{" "}
              {userProfile?.stats?.drops ?? 0} • Fused:{" "}
              {userProfile?.stats?.fused ?? 0}
            </span>
            <button
              onClick={() => setShowProfileOverlay(true)}
              style={{
                marginTop: "0.5rem",
                padding: "0.4rem 0.8rem",
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: "#00ffcc",
                background: "#002a33",
                border: "1px solid #00f0ff88",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 0 6px #00f0ff44",
              }}
            >
              🔐 Sign In
            </button>
          </div>
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            background: "linear-gradient(to right, #00f0ff, #00ff88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            textAlign: "center",
          }}
        >
          SporeZ // E.I.G.
        </h1>

        <div></div>
      </header>

      {/* 🔸 Navigation */}
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
        {["Home", "Saved Sporez", "Spore Fusion"].map((tab) => (
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

      {/* 🔘 Main Content */}
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
            <p style={{ opacity: 0.3 }}>
              Paste a link below to generate a compact Spore link.
            </p>

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

        {activeTab === "Saved Sporez" && <SavedSporez userProfile={userProfile} />}
        {activeTab === "Spore Fusion" && (
          <p style={{ opacity: 0.5 }}>
            🔬 Fusion lab coming soon. Mix identity + payloads.
          </p>
        )}
      </main>

      {showSporeOverlay && <SporeOverlay />}
      {showProfileOverlay && (
        <CreateProfileOverlay
          onClose={() => setShowProfileOverlay(false)}
        />
      )}
    </div>
  );
}
