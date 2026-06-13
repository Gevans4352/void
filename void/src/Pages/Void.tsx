import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useVoid from "../hooks/useVoid";
import useConstellation from "../hooks/useConstellation";
import usePulse from "../hooks/usePulse";
import "../styles/Void.css";

const temperatureColor: Record<string, string> = {
  warm: "#FFD36E",
  cold: "#A7C7FF",
  burning: "#D98C3A",
  frozen: "#4FD1C5",
};

const Void = () => {
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();
  const { fragments, loading, error } = useVoid();
  const { constellations } = useConstellation();
  const { pulse, pulsing } = usePulse();

  const [showDrop, setShowDrop] = useState(false);
  const [content, setContent] = useState("");
  const [temperature, setTemperature] = useState<
    "warm" | "cold" | "burning" | "frozen"
  >("warm");
  const [dropping, setDropping] = useState(false);
  const [dropError, setDropError] = useState("");

  const handleDrop = async () => {
    if (!content.trim()) {
      setDropError("fragment cannot be empty");
      return;
    }
    setDropping(true);
    setDropError("");

    try {
      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 80;
      await import("../lib/api").then((m) =>
        m.default.post("/fragments", {
          content,
          temperature,
          x,
          y,
        }),
      );
      setContent("");
      setShowDrop(false);
    } catch (err: any) {
      setDropError(err.response?.data?.error || "failed to drop fragment");
    } finally {
      setDropping(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("void_token");
    if (!token) {
      navigate("/login");
    } else {
      setAuthed(true);
    }
  }, [navigate]);

  const getFragmentPair = (constellation: any) => {
    const a = fragments.find((f) => f.id === constellation.fragment_a_id);
    const b = fragments.find((f) => f.id === constellation.fragment_b_id);
    return { a, b };
  };

  //   const token = localStorage.getItem("void_token");
  //   if (!token) {
  //     navigate("/login");
  //     return null;
  //   }
  if (!authed) {
    return null;
  }
  if (loading) {
    return (
      <div className="void-loading">
        <div className="stars" />
        <p>entering the void...</p>
      </div>
    );
  }

  return (
    <div className="void-canvas">
      <div className="stars" />

      <svg className="constellation-layer">
        {constellations.map((c) => {
          const { a, b } = getFragmentPair(c);
          if (!a || !b) return null;
          return (
            <line
              key={c.id}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke="rgba(169, 199, 255, 0.15)"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {fragments.map((f) => (
        <div
          key={f.id}
          className={`fragment ${f.status} ${pulsing === f.id ? "pulsing" : ""}`}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            color: temperatureColor[f.temperature],
          }}
          onClick={() => pulse(f.id)}
        >
          <p className="fragment-content">{f.content}</p>
          <span className="fragment-signal">{f.users?.signal_name}</span>
        </div>
      ))}

      <div className="void-nav">
        <span
          className="void-nav-link"
          onClick={() => {
            const token = localStorage.getItem("void_token");
            if (token) {
              const payload = JSON.parse(atob(token.split(".")[1]));
              navigate(`/grove/${payload.signal_name}`);
            }
          }}
        >
          my grove
        </span>
      </div>

      <button className="drop-btn" onClick={() => setShowDrop(true)}>
        + drop
      </button>

      {showDrop && (
        <div className="drop-overlay">
          <div className="drop-panel">
            <p className="drop-title">what do you leave behind</p>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="a fragment of yourself..."
              maxLength={140}
              className="drop-input"
            />

            <div className="temperature-select">
              {(["warm", "cold", "burning", "frozen"] as const).map((t) => (
                <button
                  key={t}
                  className={`temp-btn ${temperature === t ? "selected" : ""}`}
                  style={{ color: temperatureColor[t] }}
                  onClick={() => setTemperature(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {dropError && <p className="error">{dropError}</p>}

            <div className="drop-actions">
              <button onClick={() => setShowDrop(false)} className="cancel-btn">
                cancel
              </button>
              <button
                onClick={handleDrop}
                disabled={dropping}
                className="confirm-btn"
              >
                {dropping ? "..." : "release →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Void;
