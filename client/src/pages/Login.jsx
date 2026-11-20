import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/admin/login",
        {
          email: email.trim(),
          password,
        }
      );

      const token = res.data.token;

      if (!token) {
        setError("Authentication token was not received.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          "Invalid credentials or unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          background: #f4f7fc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #172033;
        }

        .login-container {
          width: 100%;
          max-width: 410px;
        }

        .login-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          margin-bottom: 30px;
        }

        .login-brand-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2563eb;
          color: #ffffff;
          border-radius: 12px;
          font-size: 23px;
          font-weight: 800;
          box-shadow: 0 5px 12px rgba(37, 99, 235, 0.18);
        }

        .login-brand-name {
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #172033;
        }

        .login-brand-subtitle {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
        }

        .login-card {
          padding: 36px;
          background: #ffffff;
          border: 1px solid #e8edf5;
          border-radius: 18px;
          box-shadow: 0 15px 45px rgba(15, 23, 42, 0.06);
        }

        .login-card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 23px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 13px;
          font-size: 24px;
        }

        .login-title {
          margin: 0;
          color: #172033;
          font-size: 27px;
          font-weight: 750;
          letter-spacing: -0.8px;
        }

        .login-description {
          margin: 9px 0 28px;
          color: #718096;
          font-size: 13px;
          line-height: 1.7;
        }

        .login-field {
          margin-bottom: 20px;
        }

        .login-label {
          display: block;
          margin-bottom: 9px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .login-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          border: 1px solid #dfe6ef;
          border-radius: 9px;
          background: #ffffff;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .login-input-wrapper:focus-within {
          border-color: #6595f5;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.09);
        }

        .login-input-icon {
          color: #94a3b8;
          font-size: 16px;
        }

        .login-input {
          width: 100%;
          min-width: 0;
          padding: 13px 0;
          border: none;
          outline: none;
          background: transparent;
          color: #172033;
          font-size: 13px;
        }

        .login-input::placeholder {
          color: #a0aec0;
        }

        .login-password-toggle {
          padding: 6px 0 6px 5px;
          border: none;
          background: transparent;
          color: #2563eb;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .login-password-toggle:hover {
          color: #1d4ed8;
        }

        .login-error {
          margin-bottom: 18px;
          padding: 11px 12px;
          border: 1px solid #fecaca;
          border-radius: 8px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 12px;
          line-height: 1.6;
        }

        .login-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 7px;
          padding: 14px 18px;
          border: none;
          border-radius: 9px;
          background: #2563eb;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 5px 12px rgba(37, 99, 235, 0.15);
          transition: background 160ms ease, transform 160ms ease;
        }

        .login-button:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .login-security {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 23px;
          color: #94a3b8;
          font-size: 11px;
        }

        .login-footer {
          margin-top: 25px;
          text-align: center;
          color: #94a3b8;
          font-size: 11px;
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 18px;
          }

          .login-brand {
            margin-bottom: 24px;
          }

          .login-card {
            padding: 27px 22px;
            border-radius: 15px;
          }

          .login-title {
            font-size: 25px;
          }
        }
      `}</style>

      <main className="login-container">
        <div className="login-brand">
          <div className="login-brand-icon">L</div>

          <div>
            <div className="login-brand-name">LeadDesk</div>
            <div className="login-brand-subtitle">
              MINI CRM PLATFORM
            </div>
          </div>
        </div>

        <section className="login-card">
          <div className="login-card-icon">↗</div>

          <h1 className="login-title">Welcome back</h1>

          <p className="login-description">
            Sign in to access your admin dashboard.
          </p>

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">
                Email address
              </label>

              <div className="login-input-wrapper">
                <span className="login-input-icon" aria-hidden="true">
                  ✉
                </span>

                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">
                <span className="login-input-icon" aria-hidden="true">
                  ⌑
                </span>

                <input
                  id="login-password"
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className="login-security">
            <span aria-hidden="true">▣</span>
            Authorized admin access only
          </div>
        </section>

        <footer className="login-footer">
          © {new Date().getFullYear()} LeadDesk Mini
        </footer>
      </main>
    </div>
  );
};

export default Login;