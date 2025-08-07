//createProfile.tsx//

import React, { useState } from "react";

type Mode = "signin" | "signup";

interface CreateProfileProps {
  onClose: () => void;
}

const CreateProfile: React.FC<CreateProfileProps> = ({ onClose }) => {
  const [sporeId, setSporeId] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!sporeId.trim() || !password.trim()) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "signup"
          ? "/.netlify/functions/create-profile"
          : "/.netlify/functions/login-profile";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: sporeId.trim(), password: password.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unexpected server error.");
      }

      console.log(`${mode.toUpperCase()} SUCCESS:`, result);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <button onClick={onClose} style={closeButtonStyle}>
        ❌
      </button>

      <div style={tabStyle}>
        {["signin", "signup"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as Mode)}
            style={{
              ...tabButtonStyle,
              background: mode === m ? "#00ffcc" : "transparent",
              color: mode === m ? "#000" : "#00ffcc",
            }}
          >
            {m === "signin" ? "Sign In" : "Create Profile"}
          </button>
        ))}
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
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={submitButtonStyle} disabled={loading}>
          {loading
            ? mode === "signup"
              ? "Creating..."
              : "Signing In..."
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

const tabButtonStyle: React.CSSProperties = {
  border: "1px solid #00ffcc",
  borderRadius: "6px",
  padding: "0.5rem 1rem",
  marginRight: "0.5rem",
  cursor: "pointer",
  fontWeight: "bold",
  background: "transparent",
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

export default CreateProfile;
