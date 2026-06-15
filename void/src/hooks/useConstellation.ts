import { useState, useEffect } from "react";
import api from "../lib/api";
import { supabase } from "../lib/supabase";

export interface Constellation {
  id: string;
  fragment_a_id: string;
  fragment_b_id: string;
  generated_name: string;
  formed_at: string;
}

const useConstellation = () => {
  const [constellations, setConstellations] = useState<Constellation[]>([]);

  useEffect(() => {
    const fetchConstellations = async () => {
      try {
        const res = await api.get("/constellations");
        setConstellations(res.data.constellations || []);
      } catch (err) {
        console.log("constellation fetch failed", err);
      }
    };

    fetchConstellations();

    const channel = supabase
      .channel("void-constellations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "constellations" },
        (payload) => {
          setConstellations((prev) => [...prev, payload.new as Constellation]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { constellations };
};

export default useConstellation;
