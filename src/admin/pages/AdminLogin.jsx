import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && pass === "admin123") {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", email);
      alert("✅ Login successful");
      // Force navigation with replace
      setTimeout(() => {
        window.location.href = "/admin";
      }, 100);
    } else {
      alert("❌ Invalid credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
          padding: "40px 32px",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "28px", color: "#4f3ca7", fontWeight: 700, letterSpacing: 1 }}>
          🔐 Admin Login
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "18px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              transition: "border 0.2s",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "24px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              transition: "border 0.2s",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(118, 75, 162, 0.15)",
              transition: "background 0.2s",
            }}
          >
            Login
          </button>
        </form>
        <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          Default: admin@gmail.com / admin123
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
