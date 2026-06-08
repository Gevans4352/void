const supabase = require("../lib/supabase");
require("dotenv").config();

const getCurrentCarousel = async (req, res) => {
  try {
    const now = new Date().toISOString();

    const { data: event, error } = await supabase
      .from("carousel_events")
      .select(
        "*, fragment(*, users(signal_name, signal_color, signal_shape, signal_frequency",
      )
      .lte("started_at", now)
      .gte("ends_at", now)
      .order("started_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    res.status(200).json({
      fragment: event?.fragments ?? null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getCurrentCarousel };
