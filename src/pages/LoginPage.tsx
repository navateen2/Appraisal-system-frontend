import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../api_service/auth/login.api";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // The backend expects email in username field
      const result = await login({ username: email, password }).unwrap();
      if (result && result.access_token) {
        localStorage.setItem("token", result.access_token);
        
        // Decode token to find role
        try {
          const payload = JSON.parse(atob(result.access_token.split(".")[1]));
          localStorage.setItem("userRole", payload.role || "Employee");
          localStorage.setItem("userEmail", payload.email || email);
          localStorage.setItem("userId", payload.id || "1");
        } catch (e) {
          localStorage.setItem("userRole", "Employee");
        }

        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.data?.detail || "Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/src/assets/TCP.svg" alt="TalentCycle Pro Logo" className="login-logo" />
          <h1 className="login-title">TalentCycle Pro</h1>
          <p className="login-subtitle">Appraisal Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Demo accounts (Username / Password):</p>
          <div className="demo-accounts">
            <div><strong>Employee:</strong> employee@company.com / password</div>
            <div><strong>Lead:</strong> lead@company.com / password</div>
          </div>
        </div>
      </div>
    </div>
  );
}
