const supabase = require("../lib/supabase");
require("dotenv").config();

const getGrove = async (req, res) => {
  const { signal } = req.params;

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        "id, signal_name, signal_color, signal_shape, signal_frequency, created_at",
      )
      .eq("signal_name", signal)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        error: "Grove not found",
      });
    }

    const { data: fragments, error: fragmentError } = await supabase
      .from("fragments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });
    if (fragmentError) {
      throw fragmentError;
    }

    const fragmentIds = fragments?.map((f) => f.id) || [];

    if (fragmentIds.length === 0) {
      return res.status(200).json({
        user,
        fragments: [],
        constellation: [],
      });
    }

    const { data: constellations, error: constellationsError } = await supabase
      .from("constellations")
      .select(
        "*, fragment_A:fragment_a_id(content, temperature), fragment_b:fragment_b_id(content, temperature)",
      )
      .or(
        `fragment_A_id.in.(${fragmentIds.join(",")}), fragment_b_id.in(${fragmentIds.join(",")})`,
      );

    if (constellationsError) {
      throw constellationsError;
    }
    res.status(200).json({
      user,
      fragments,
      constellations,
    });
  } catch (error) {
    console.log("error");
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getGrove };
