import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "80px",
        paddingBottom: "80px",
        background: "#f7f7f7",
        minHeight: "70vh",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          marginBottom: "10px",
          color: "#222",
        }}
      >
        Welcome to <span style={{ color: "#4a74ff" }}>CableFix</span>
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#555",
          marginBottom: "25px",
        }}
      >
        Your one-stop shop for cables & accessories
      </p>

      <Link
        to="/products"
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          background: "#4a74ff",
          color: "#fff",
          fontSize: "16px",
          textDecoration: "none",
          display: "inline-block",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#3558d8";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#4a74ff";
        }}
      >
        Browse Products
      </Link>
    </div>
  );
}
