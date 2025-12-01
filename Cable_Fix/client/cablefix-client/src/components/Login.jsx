import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      nav("/products");
    } catch (err) {
      alert(err.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "60px auto",
        padding: "30px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "28px",
          color: "#333",
        }}
      >
        Login
      </h2>

      <form onSubmit={submit} style={{ display: "grid", gap: "14px" }}>
        <input
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
            transition: "0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4a74ff")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
            transition: "0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4a74ff")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />

        <button
          disabled={busy}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: busy ? "#9aa8ff" : "#4a74ff",
            color: "white",
            fontSize: "16px",
            cursor: busy ? "not-allowed" : "pointer",
            transition: "0.2s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            if (!busy) e.target.style.background = "#3558d8";
          }}
          onMouseLeave={(e) => {
            if (!busy) e.target.style.background = "#4a74ff";
          }}
        >
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
