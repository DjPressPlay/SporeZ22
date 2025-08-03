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

        {/* 🧬 Rotating Orbiting Spores */}
        <div className="spore-ring">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="spore-spore" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      </div>

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

        .spore-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          margin-top: -100px;
          margin-left: -100px;
          animation: rotateRing 10s linear infinite;
          pointer-events: none;
        }

        .spore-spore {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00f0ff;
          box-shadow: 0 0 10px #00f0ffaa;
          transform-origin: 100px 100px;
          animation: pulseSpore 2s ease-in-out infinite;
        }

        .spore-spore {
          transform: rotate(calc(var(--i) * 45deg)) translate(100px);
        }

        @keyframes rotateRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseSpore {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.4);
            opacity: 1;
          }
        }
@keyframes floatAcrossThenIn {
  0% {
    transform: translateX(-100vw) scale(0.3);
    opacity: 0;
  }
  45% {
    transform: translateX(25vw) scale(1.08);
    opacity: 0.85;
  }
  75% {
    transform: translateX(5vw) scale(1.02);
    opacity: 0.95;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

      `}</style>
    </div>
  );
}
