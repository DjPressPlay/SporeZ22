import React from "react";

export default function SporeOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          width: "300px",
          height: "300px",
          background: "#001a26",
          borderRadius: "20px",
          border: "2px solid #00f0ff88",
          boxShadow: "0 0 40px #00f0ff88",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          color: "#00f0ff",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Generating Spore...
      </div>
    </div>
  );
}
