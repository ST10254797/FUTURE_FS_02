import React, { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      if (res.data.loggedIn) {
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Admin Portal</h2>
          <p style={styles.subtitle}>Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>Secure Admin Access Only</p>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7fe", // Light blue-grey background
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
  },
  header: {
    marginBottom: "32px",
    textAlign: "center",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1b254b",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#a3aed0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1b254b",
    marginLeft: "4px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #e0e5f2",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#4318FF", // Modern blue
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    transition: "background-color 0.2s",
  },
  errorBox: {
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#fff5f5",
    color: "#e53e3e",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid #feb2b2",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "12px",
    color: "#a3aed0",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }
};

export default AdminLogin;