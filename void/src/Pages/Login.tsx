import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react";
import api from "../lib/api";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();
  const orbRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 40;
      targetY = (e.clientY / window.innerHeight - 0.5) * 40;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      orb.style.transform = `translateY(-50%) translate(${currentX}px, ${currentY}px)`;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleEmailNext = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("enter a valid email");
      return;
    }
    setError("");
    setEmailDone(true);
    setTimeout(() => passwordRef.current?.focus(), 100);
  };

  const handleSubmit = async () => {
    if (!password) {
      setError("enter your password");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("void_token", res.data.token);
      navigate("/void");
    } catch (err: any) {
      setError(err.response?.data?.error || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="stars" />
      <div className="orb" ref={orbRef} />

      <div className="register-form">
        <p className="register-transmission">VOID/AUTH · SIGNAL SEARCH</p>
        <h2 className="register-title">you've been here before</h2>

        <div className="field-group">
          <div className={`field ${emailDone ? "done" : "active"}`}>
            <label>email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !emailDone && handleEmailNext()
              }
              disabled={emailDone}
              placeholder="your signal origin"
            />
            {!emailDone && (
              <button onClick={handleEmailNext} className="next-btn">
                →
              </button>
            )}
          </div>

          <div className={`field ${!emailDone ? "locked" : "active"}`}>
            <label>password</label>
            <div className="input-wrap">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && emailDone && handleSubmit()
                }
                disabled={!emailDone}
                placeholder="your encryption"
              />
              <span
                onClick={() => setShowPassword((p) => !p)}
                className="eye-icon"
              >
                {showPassword ? <EyeIcon size={16} /> : <EyeIcon size={16} />}
              </span>
            </div>
            {emailDone && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="next-btn"
              >
                {loading ? "..." : "→"}
              </button>
            )}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <p className="login-link" onClick={() => navigate("/register")}>
          i don't exist yet →
        </p>
      </div>
    </div>
  );
};

export default Login;
