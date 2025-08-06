// src/CreateProfile.tsx
// src/CreateProfile.tsx
import React, { useState } from "react";

const CreateProfile = ({ onClose }: { onClose: () => void }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // ✅ PLACE AUTH LOGIC HERE (e.g. Supabase, Firebase, Local)
    // Example with Supabase:
    // const { data, error } = await supabase.auth.signUp({ email, password });

    console.log("Create user:", { username, email, password });

    // Clear or close on success
    onClose();
  };

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

      <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Create Profile</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={inputStyle}
          required
        />

        <button
          type="submit"
          style={{
            background: "#00ffcc",
            color: "#000",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "bold",
            marginTop: "1rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

// 🔹 Shared Input Style
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  background: "#222",
  color: "#fff",
  border: "1px solid #00ffcc",
  borderRadius: "8px",
};

export default CreateProfile;
