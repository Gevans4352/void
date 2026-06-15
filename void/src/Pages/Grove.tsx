import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Radio, Ghost, Sparkles } from "lucide-react";
import api from "../lib/api";
import "../styles/Grove.css";

interface Fragment {
  id: string;
  content: string;
  temperature: "warm" | "cold" | "burning" | "frozen";
  status: "active" | "ghost" | "risen";
  created_at: string;
  x: number;
  y: number;
}

interface Constellation {
  id: string;
  generated_name: string;
  formed_at: string;
  fragment_a: { content: string; temperature: string };
  fragment_b: { content: string; temperature: string };
}

interface User {
  id: string;
  signal_name: string;
  signal_color: string;
  signal_shape: string;
  signal_frequency: string;
  created_at: string;
}

const temperatureColor: Record<string, string> = {
  warm: "#FFD36E",
  cold: "#A7C7FF",
  burning: "#D98C3A",
  frozen: "#4FD1C5",
};

const Grove = () => {
  const { signal } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCore, setHoveredCore] = useState(false);
  const [selectedFragment, setSelectedFragment] = useState<Fragment | null>(
    null,
  );
  const [selectedConstellation, setSelectedConstellation] =
    useState<Constellation | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("void_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchGrove = async () => {
      try {
        const res = await api.get(`/grove/${signal}`);
        setUser(res.data.user);
        setFragments(res.data.fragments || []);
        setConstellations(res.data.constellations || []);
      } catch (err) {
        console.log("grove fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrove();
  }, [signal, navigate]);

  const activeFragments = fragments.filter(
    (f) => f.status === "active" || f.status === "risen",
  );
  const ghostFragments = fragments.filter((f) => f.status === "ghost");

  const signalAge = user
    ? Math.floor(
        (Date.now() - new Date(user.created_at).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const coreSize = 120 + activeFragments.length * 8;
  const coreGlow = Math.min(activeFragments.length * 10, 60);
  const hasDistortion = ghostFragments.length > 2;

  if (loading) {
    return (
      <div className="grove-loading">
        <div className="stars" />
        <p>locating signal...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grove-loading">
        <div className="stars" />
        <p>signal not found</p>
      </div>
    );
  }

  return (
    <div className="grove">
      <div className="stars" />

      <div className="grove-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="grove-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <button className="grove-back" onClick={() => navigate("/void")}>
        <ArrowLeft size={14} />
        <span>back to void</span>
      </button>

      {/* SIGNAL CORE */}
      <div className="grove-core-section">
        <div
          className={`signal-core ${hasDistortion ? "distorted" : ""}`}
          style={{
            width: coreSize,
            height: coreSize,
            boxShadow: `0 0 ${coreGlow}px rgba(45, 91, 255, 0.4), 0 0 ${coreGlow * 2}px rgba(139, 92, 246, 0.2)`,
          }}
          onMouseEnter={() => setHoveredCore(true)}
          onMouseLeave={() => setHoveredCore(false)}
        >
          <div className="core-inner" />
          <div className="core-ring ring-1" />
          <div className="core-ring ring-2" />
          <div className="core-ring ring-3" />

          <div className={`core-info ${hoveredCore ? "visible" : ""}`}>
            <div className="core-stat">
              <Radio size={10} />
              signal age <span>{signalAge} cycles</span>
            </div>
            <div className="core-stat">
              <Sparkles size={10} />
              active fragments <span>{activeFragments.length}</span>
            </div>
            <div className="core-stat">
              <Ghost size={10} />
              lost fragments <span>{ghostFragments.length}</span>
            </div>
            <div className="core-stat">
              <Sparkles size={10} />
              constellations <span>{constellations.length}</span>
            </div>
          </div>
        </div>
        <div className="core-stats-mobile">
          <div className="core-stat">
            <Radio size={10} />
            <span>{signalAge} cycles old</span>
          </div>
          <div className="core-stat">
            <Sparkles size={10} />
            <span>{activeFragments.length} active</span>
          </div>
          <div className="core-stat">
            <Ghost size={10} />
            <span>{ghostFragments.length} lost</span>
          </div>
          <div className="core-stat">
            <Radio size={10} />
            <span>{constellations.length} constellations</span>
          </div>
        </div>

        <h2 className="grove-signal-name">{user.signal_name}</h2>
        <p className="grove-signal-freq">
          {user.signal_frequency} · {user.signal_shape}
        </p>
      </div>

      {/* ACTIVE FRAGMENTS */}
      <div className="grove-section">
        <p className="grove-section-label">
          <Sparkles size={10} />
          active fragments
        </p>

        {activeFragments.length === 0 ? (
          <p className="grove-empty">no fragments drifting yet</p>
        ) : (
          <div className="fragments-grid">
            {activeFragments.map((f) => (
              <div
                key={f.id}
                className="fragment-shard"
                style={{ color: temperatureColor[f.temperature] }}
                onClick={() => setSelectedFragment(f)}
              >
                <p className="shard-content">{f.content}</p>
                <div className="shard-meta">
                  <span className="shard-temp">{f.temperature}</span>
                  <span className="shard-age">
                    {Math.floor(
                      (Date.now() - new Date(f.created_at).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    cycles ago
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GHOST FRAGMENTS */}
      {ghostFragments.length > 0 && (
        <div className="grove-section">
          <p className="grove-section-label">
            <Ghost size={10} />
            lost to the void
          </p>
          <div className="fragments-grid">
            {ghostFragments.map((f) => (
              <div key={f.id} className="fragment-shard ghost-shard">
                <p className="shard-content">{f.content}</p>
                <div className="shard-meta">
                  <span className="shard-temp">{f.temperature}</span>
                  <span className="shard-age">
                    last seen{" "}
                    {Math.floor(
                      (Date.now() - new Date(f.created_at).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    cycles ago
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSTELLATION WALL */}
      <div className="grove-section">
        <p className="grove-section-label">
          <Radio size={10} />
          constellations formed
        </p>

        {constellations.length === 0 ? (
          <p className="grove-empty">no constellations yet — keep drifting</p>
        ) : (
          <div className="constellation-wall">
            {constellations.map((c) => (
              <div
                key={c.id}
                className="constellation-node"
                onClick={() => setSelectedConstellation(c)}
              >
                <p className="constellation-name">{c.generated_name}</p>
                <p className="constellation-preview">
                  <span>"{c.fragment_a?.content}"</span>
                  {" → "}
                  <span>"{c.fragment_b?.content}"</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EXPANDED FRAGMENT */}
      {selectedFragment && (
        <div
          className="fragment-expanded"
          onClick={() => setSelectedFragment(null)}
        >
          <div
            className="fragment-expanded-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="expanded-close"
              onClick={() => setSelectedFragment(null)}
            >
              close
            </button>
            <p className="expanded-content">{selectedFragment.content}</p>
            <p className="expanded-meta">
              {selectedFragment.temperature} · {selectedFragment.status} ·{" "}
              {Math.floor(
                (Date.now() - new Date(selectedFragment.created_at).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              cycles ago
            </p>
          </div>
        </div>
      )}

      {/* EXPANDED CONSTELLATION */}
      {selectedConstellation && (
        <div
          className="fragment-expanded"
          onClick={() => setSelectedConstellation(null)}
        >
          <div
            className="fragment-expanded-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="expanded-close"
              onClick={() => setSelectedConstellation(null)}
            >
              close
            </button>
            <p className="constellation-name">
              {selectedConstellation.generated_name}
            </p>
            <p className="expanded-content">
              "{selectedConstellation.fragment_a?.content}"
            </p>
            <p className="expanded-meta">connected to</p>
            <p className="expanded-content">
              "{selectedConstellation.fragment_b?.content}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grove;
