const supabase = require("../lib/supabase");
require("dotenv").config();

const getConstellations = async (req, res) => {
  try {
    const { data: constellations, error } = await supabase
      .from("constellations")
      .select(
        "*, fragment_a:fragment_a_id(content, temperature, x, y, users(Signal_name, signal_control)), fragment_b:fragment_b_id(content, temperature, x, y, users(Signal_name, signal_color))",
      )
      .order("formed_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }
    res.status(200).json({ constellations });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getConstellation }
