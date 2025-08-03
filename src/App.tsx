import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");

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
      {/* 🔹 Header Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid #00f0ff33",
          background: "#000a12",
        }}
      >
        {/* 👤 Profile Section + Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Avatar */}
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "radial-gradient(circle at center, #00f0ff55, #001a26)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "2rem",
              cursor: "pointer",
              border: "2px solid #00f0ff88",
              boxShadow: "0 0 12px #00f0ff55",
            }}
          >
            🧬
          </div>

          {/* 🧾 Info Container */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "bold", color: "#00ffcc" }}>Z-Entity: EGG-91XZ</span>
            <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>
              XP: 240 • Drops: 3 • Fused: 1
            </span>
          </div>
        </div>

        {/* 🧠 Title */}
        <h1
          style={{
            fontSize: "1.5rem",
            background: "linear-gradient(to right, #00f0ff, #00ff88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          SporeZ // E.I.G.
        </h1>

        {/* Empty right block for symmetry */}
        <div style={{ width: "40px" }}></div>
      </header>

      {/* 🔸 Nav Tabs */}
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

      {/* 🔘 Main Content Panel */}
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

            {/* 🧪 URL Input Field */}
            <div style={{ marginTop: "2rem", width: "100%", maxWidth: 500 }}>
              <input
                type="text"
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

        {activeTab === "Saved Sporez" && (
          <p style={{ opacity: 0.5 }}>🧬 Your previously dropped Sporez will show here.</p>
        )}

        {activeTab === "Spore Fusion" && (
          <p style={{ opacity: 0.5 }}>🔬 Fusion lab coming soon. Mix identity + payloads.</p>
        )}
      </main>
    </div>
  );
}
