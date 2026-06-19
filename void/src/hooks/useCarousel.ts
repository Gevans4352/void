import { useState, useEffect } from "react";
import api from "../lib/api";
import { supabase } from "../lib/supabase";

export interface CarouselFragment {
  id: string;
  content: string;
  temperature: "warm" | "cold" | "burning" | "frozen";
  status: "risen";
  x: number;
  y: number;
  created_at: string;
  users: {
    signal_name: string;
    signal_color: string;
    signal_shape: string;
    signal_frequency: string;
  };
}

const useCarousel = () => {
  const [risen, setRisen] = useState<CarouselFragment | null>(null);

  const fetchCarousel = async () => {
    try {
      const res = await api.get("/carousel/current");
      setRisen(res.data.fragment);
    } catch (err) {
      console.log("carousel fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCarousel();

    const channel = supabase
      .channel("void-carousel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "carousel_events" },
        () => {
          fetchCarousel();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { risen };
};

export default useCarousel;
