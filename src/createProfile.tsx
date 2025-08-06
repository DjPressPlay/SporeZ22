// src/CreateProfile.tsx
import React from "react";

const CreateProfile = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#111",
        border: "2px solid #00ffcc",
        borderRadius: "12px",
        padding: "2rem",
        zIndex: 1000,
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 0 30px #00ffcc",
      }}
    >
      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          color: "#fff",
          fontSize: "1.5rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        ❌
      </button>

      {/* Inside Content */}
      <h2 style={{ color: "#00ffcc" }}>Create Profile</h2>
      {/* Add your fields here... */}
    </div>
  );
};

export default CreateProfile;
