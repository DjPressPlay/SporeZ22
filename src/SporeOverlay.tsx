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
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* 🌬️ Floating Spore Container */}
      <div className="spore-core">
        {/* 🌐 GIF Placeholder */}
        <div className="spore-gif">
          <span>[GIF Slot]</span>
        </div>
        Generating Spore...
      </div>

      {/* 🎇 Particle Trails */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="spore-particle" />
      ))}

      {/* 🔮 Animation Styles */}
      <style>{`
        .spore-core {
          width: 300px;
          height: 300px;
          background: #001a26;
          border-radius: 20px;
          border: 2px solid #00f0ff88;
          box-shadow: 0 0 40px #00f0ff88, 0 0 100px #00f0ff22 inset;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #00f0ff;
          font-weight: bold;
          text-align: center;
          animation: floatAcrossThenIn 2s ease-in-out forwards;
          position: relative;
          opacity: 0;
        }

        .spore-gif {
          width: 100%;
          height: 150px;
          background: #00232e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          border-radius: 12px;
          overflow: hidden;
          font-size: 0.75rem;
          opacity: 0.5;
        }

        @keyframes floatAcrossThenIn {
          0% {
            transform: translateX(-100vw) translateY(0px) scale(0.3);
            opacity: 0;
          }
          40% {
            transform: translateX(30vw) translateY(-40px) scale(1.1);
            opacity: 0.8;
          }
          70% {
            transform: translateX(10vw) translateY(20px) scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
        }

        .spore-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00f0ff;
          opacity: 0.2;
          animation: trailFloat 3s infinite ease-in-out;
          animation-delay: calc(0.1s * var(--i));
          top: calc(50% + (Math.random() * 100 - 50)px);
          left: calc(50% + (Math.random() * 100 - 50)px);
        }

        @keyframes trailFloat {
          0% {
            transform: scale(0.2) translateY(0);
            opacity: 0.1;
          }
          50% {
            transform: scale(0.6) translateY(-20px);
            opacity: 0.4;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
