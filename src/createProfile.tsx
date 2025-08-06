// src/CreateProfile.tsx
// src/CreateProfile.tsx
import React, { useState } from "react";

const CreateProfile = ({ onClose }: { onClose: () => void }) => {
  const [sporeId, setSporeId] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!sporeId.trim() || !password.trim()) {
      setError("Both fields are required.");
      return;
    }

    const endpoint =
      mode === "signup"
        ? "/.netlify/functions/create-profile"
        : "/.netlify/functions/login-profile";

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: sporeId, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      console.log(`${mode} success:`, result);
      onClose(); // ✅ close modal
    } catch (err: any) {
      setError(err.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* ❌ Close Button */}
      <button onClick={onClose} style={closeButtonStyle}>
        ❌
      </button>

      {/* Toggle Sign In / Sign Up */}
      <div style={tabStyle}>
        <button
          onClick={() => setMode("signin")}
          style={{
            ...tabButtonStyle,
            background: mode === "signin" ? "#00ffcc" : "transparent",
            color: mode === "signin" ? "#000" : "#00ffcc",
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode("signup")}
          style={{
            ...tabButtonStyle,
            background: mode === "signup" ? "#00ffcc" : "transparent",
            color: mode === "signup" ? "#000" : "#00ffcc",
          }}
        >
          Create Profile
        </button>
      </div>

      <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>
        {mode === "signup" ? "Create Profile" : "Sign In"}
      </h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <input
          type="text"
          placeholder="Spore ID"
          value={sporeId}
          onChange={(e) => setSporeId(e.target.value)}
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

        <button type="submit" style={submitButtonStyle} disabled={loading}>
          {loading
            ? mode === "signup"
              ? "Creating..."
              : "Signing in..."
            : mode === "signup"
            ? "Create Profile"
            : "Sign In"}
        </button>
      </form>
    </div>
  );
};

// 🔹 Styles
const containerStyle: React.CSSProperties = {
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
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  color: "#fff",
  fontSize: "1.5rem",
  border: "none",
  cursor: "pointer",
};

const tabStyle: React.CSSProperties = {
  marginBottom: "1rem",
  textAlign: "center",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  background: "#222",
  color: "#fff",
  border: "1px solid #00ffcc",
  borderRadius: "8px",
};

const submitButtonStyle: React.CSSProperties = {
  background: "#00ffcc",
  color: "#000",
  border: "none",
  padding: "0.75rem 1.5rem",
  borderRadius: "8px",
  fontWeight: "bold",
  marginTop: "1rem",
  cursor: "pointer",
  width: "100%",
};

const tabButtonStyle: React.CSSProperties = {
  border: "1px solid #00ffcc",
  borderRadius: "6px",
  padding: "0.5rem 1rem",
  marginRight: "0.5rem",
  cursor: "pointer",
  fontWeight: "bold",
  background: "transparent",
};

export default CreateProfile;
