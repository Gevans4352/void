import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "../index.css";

const whispers = [
  "your signal is permanent.",
  "things drift here.",
  "you are not alone.",
  "when two fragments meet...",
  "nothing demands your attention.",
  "you will never know who you are connected to.",
];

const Landing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fragments, setFragments] = useState<
    { text: string; x: number; y: number; delay: number }[]
  >([]);

  // step timers
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 3500);
    const t4 = setTimeout(() => setStep(4), 5000);
    const t5 = setTimeout(() => setStep(5), 6500);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  // scatter whispers
  useEffect(() => {
    if (step < 3) return;

    const placed = whispers.map((text, i) => {
      // keep away from center (title) and edges
      const zones = [
        { x: [5, 25], y: [10, 30] },
        { x: [70, 90], y: [10, 30] },
        { x: [5, 20], y: [65, 85] },
        { x: [75, 92], y: [65, 85] },
        { x: [30, 45], y: [8, 20] },
        { x: [55, 70], y: [75, 88] },
      ];
      const zone = zones[i % zones.length];
      return {
        text,
        x: zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]),
        y: zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]),
        delay: i * 0.5,
      };
    });

    setFragments(placed);
  }, [step]);

  const enter = useCallback(() => navigate("/register"), [navigate]);
  const login = useCallback(() => navigate("/login"), [navigate]);

  return (
    <div className="landing">
      <div className="stars" />

      {step >= 4 && (
        <div className="signal">SIGNAL DETECTED · VOID/001</div>
      )}

      {step >= 1 && step < 3 && (
        <div className="intro">
          <p>you were not supposed to find this.</p>
          <p>but here you are.</p>
        </div>
      )}

      {step >= 3 && <h1 className="void-title">VOID</h1>}

      {step >= 3 &&
        fragments.map((f, i) => (
          <p
            key={i}
            className="whisper"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              animationDelay: `${f.delay}s`,
            }}
          >
            {f.text}
          </p>
        ))}

      {step >= 5 && (
        <div className="links">
          <a onClick={enter}>enter the void →</a>
          <a onClick={login}>i already exist →</a>
        </div>
      )}
    </div>
  );
};

export default Landing;