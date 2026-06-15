import { useState, useEffect } from "react";
import api from "../lib/api";
import { supabase } from "../lib/supabase";

export interface Fragment {
  id: string;
  user_id: string;
  content: string;
  temperature: "warm" | "cold" | "burning" | "frozen";
  x: number;
  y: number;
  status: "active" | "ghost" | "risen";
  created_at: string;
  users: {
    signal_name: string;
    signal_color: string;
    signal_shape: string;
  };
}

const useVoid = () => {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFragments = async () => {
    try {
      const res = await api.get("/fragments");
      setFragments(res.data.fragments || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "failed to load void");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFragments();

    const channel = supabase
      .channel("void-fragments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fragments" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFragments((prev) => [payload.new as Fragment, ...prev]);
          }
          if (payload.eventType === "UPDATE") {
            setFragments((prev) =>
              prev.map((f) =>
                f.id === payload.new.id ? { ...f, ...payload.new } : f,
              ),
            );
          }
          if (payload.eventType === "DELETE") {
            setFragments((prev) => prev.filter((f) => f.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { fragments, loading, error, refetch: fetchFragments };
};

export default useVoid;
