import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import api from "../lib/api";
import "../index.css";

interface PasswordStrength {
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isLong: boolean;
}

const checkStrength = (password: string): PasswordStrength => ({
  hasUpper: /[A-Z]/.test(password),
  hasLower: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[^A-Za-z0-9]/.test(password),
  isLong: password.length >= 8,
});

const isStrongEnough = (s: PasswordStrength) =>
  s.hasUpper && s.hasLower && s.hasNumber && s.hasSpecial && s.isLong;

const Register = () => {
  const navigate = useNavigate();
  const orbRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [passwordDone, setPasswordDone] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    isLong: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signal, setSignal] = useState<{
    signal_name: string;
    signal_color: string;
  } | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let frameId: number;

    // Handle Mouse Movement
    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 60;
      targetY = (e.clientY / window.innerHeight - 0.5) * 60;
    };

    // Handle Touch Movement (for Tablets)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetX = (touch.clientX / window.innerWidth - 0.5) * 60;
        targetY = (touch.clientY / window.innerHeight - 0.5) * 60;
      }
    };

    const animate = () => {
      // Smooth interpolation (the 0.05 makes it "floaty")
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      
      // We apply the movement + the spinning is handled in CSS
      orb.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px)`;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);


  useEffect(() => {
    setStrength(checkStrength(password));
  }, [password]);

  const handleEmailNext = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("enter a valid email");
      return;
    }
    setError("");
    setEmailDone(true);
    setTimeout(() => passwordRef.current?.focus(), 100);
  };

  const handlePasswordNext = () => {
    if (!isStrongEnough(strength)) {
      setError("password is not strong enough");
      return;
    }
    setError("");
    setPasswordDone(true);
    setTimeout(() => confirmRef.current?.focus(), 100);
  };

  const handleSubmit = async () => {
    if (confirm !== password) {
      setError("passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", { email, password });
      localStorage.setItem("void_token", res.data.token);
      setSignal(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!signal) return;
    const timer = setTimeout(() => navigate("/void"), 4000);
    return () => clearTimeout(timer);
  }, [signal, navigate]);

  if (signal) {
    return (
      <div className="signal-reveal">
        <div className="stars" />
        <p className="signal-label">signal assigned</p>
        <h2 className="signal-name">{signal.signal_name}</h2>
        <p className="signal-sub">entering the void...</p>
      </div>
    );
  }

  return (
    <div className="register">
      <div className="stars" />
      <div className="orb" ref={orbRef} />

      <div className="register-form">
        <p className="register-transmission">VOID/REG · SIGNAL PENDING</p>
        <h2 className="register-title">who are you</h2>

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

          <div
            className={`field ${!emailDone ? "locked" : passwordDone ? "done" : "active"}`}
          >
            <label>password</label>
            <div className="input-wrap">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  emailDone &&
                  !passwordDone &&
                  handlePasswordNext()
                }
                disabled={!emailDone || passwordDone}
                placeholder="encrypt yourself"
              />
              <span
                onClick={() => setShowPassword((p) => !p)}
                className="eye-icon"
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {emailDone && !passwordDone && (
              <div className="strength-checks">
                <span className={strength.isLong ? "met" : ""}>8+ chars</span>
                <span className={strength.hasUpper ? "met" : ""}>
                  uppercase
                </span>
                <span className={strength.hasLower ? "met" : ""}>
                  lowercase
                </span>
                <span className={strength.hasNumber ? "met" : ""}>number</span>
                <span className={strength.hasSpecial ? "met" : ""}>
                  special
                </span>
              </div>
            )}
            {!passwordDone && emailDone && (
              <button onClick={handlePasswordNext} className="next-btn">
                →
              </button>
            )}
          </div>

          <div className={`field ${!passwordDone ? "locked" : "active"}`}>
            <label>confirm password</label>
            <div className="input-wrap">
              <input
                ref={confirmRef}
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && passwordDone && handleSubmit()
                }
                disabled={!passwordDone}
                placeholder="confirm your signal"
              />
              <span
                onClick={() => setShowConfirm((p) => !p)}
                className="eye-icon"
              >
                {showConfirm ? <EyeSlash size={16} /> : <Eye size={16} />}
              </span>
            </div>
            {passwordDone && (
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

        <p className="login-link" onClick={() => navigate("/login")}>
          i already exist →
        </p>
      </div>
    </div>
  );
};

export default Register;
