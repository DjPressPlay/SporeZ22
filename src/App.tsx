import React from "react";

export default function App() {
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
        {/* 👤 Profile Icon */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#00f0ff44",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          🧬
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

        {/* Placeholder for right-side icon if needed */}
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
            style={{
              background: "none",
              border: "none",
              color: "#00f0ff",
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

      {/* 🔘 Main Body Placeholder */}
      <main
        style={{
          flexGrow: 1,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ opacity: 0.5 }}>Welcome to the SporeZ Engine</h2>
        <p style={{ opacity: 0.3 }}>Select a tab or begin generating a new identity...</p>
      </main>
    </div>
  );
}
