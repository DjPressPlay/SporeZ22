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
        pointerEvents: "none", // prevent blocking clicks underneath when animating
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          color: "#00f0ff",
          fontWeight: "bold",
          textAlign: "center",
          animation: "pollenFloatIn 1.5s ease-out forwards",
          opacity: 0,
          transform: "translateZ(-500px) scale(0.5)",
        }}
      >
        {/* 🌐 GIF Container (you'll insert image src later) */}
        <div
          style={{
            width: "100%",
            height: "150px",
            background: "#00232e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Insert GIF here later */}
          <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>[GIF Slot]</span>
        </div>

        Generating Spore...
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes pollenFloatIn {
            0% {
              transform: translateZ(-500px) scale(0.3) translateY(80px);
              opacity: 0;
            }
            60% {
              transform: translateZ(0px) scale(1.05) translateY(-10px);
              opacity: 0.85;
            }
            100% {
              transform: translateZ(0px) scale(1.0) translateY(0px);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}
