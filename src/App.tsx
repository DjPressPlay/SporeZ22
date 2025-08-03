import React from "react";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #00040f, #00111a)",
        color: "#00f0ff",
        fontFamily: "monospace",
        padding: "3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          background: "linear-gradient(to right, #00f0ff, #00ff88)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Spore’z Link Engine
      </h1>

      {/* Subtitle */}
      <p style={{ fontSize: "1rem", opacity: 0.7, textAlign: "center", maxWidth: 500 }}>
        Create compact identity links tied to hidden rewards, drops, or viral chain pages.
      </p>

      {/* Input Box */}
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

      {/* Footer */}
      <p style={{ marginTop: "auto", fontSize: "0.8rem", opacity: 0.3 }}>
        ⛩️ Powered by ZetsuCorp // Built for propagation.
      </p>
    </div>
  );
}
