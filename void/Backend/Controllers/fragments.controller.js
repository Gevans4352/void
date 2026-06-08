const supabase = require("../lib/supabase");
require("dotenv").config();

const getFragments = async (req, res) => {
  try {
    const { data: fragments, error } = await supabase
      .from("fragments")
      .select("*, users(signal_name, signal_color, signal_shape)")
      .in("status", ["active", "risen"])
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json({
      fragments,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const dropFragment = async (req, res) => {
  const { content, temperature, x, y } = req.body;
  const user_id = req.user.user_id;

  if (!content || temperature === undefined) {
    return res.status(400).json({
      error: "Content and temperature are required",
    });
  }

  try {
    const { data: fragments, error } = await supabase
      .from("fragments")
      .insert([
        {
          user_id,
          content,
          temperature,
          x: x || 0,
          y: y || 0,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }
    res.status(201).json({
      fragments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

const retireFragment = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const { data: fragments, error } = await supabase
      .from("fragments")
      .update({
        status: "ghost",
        retired_at: new Date(),
      })
      .eq("id", id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!fragments) {
      return res.status(404).json({
        error: "Fragment not found",
      });
    }
    res.status(200).json({
      fragments,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const pulseFragment = async (req, res) => {
  const { id } = req.params;
  const pulsed_by = req.user.id;

  try {
    const { data: existing, error: checkError } = await supabase
      .from("pulses")
      .select("id")
      .eq("fragment_id", id)
      .eq("pulsed_by", pulsed_by)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      throw checkError;
    }
    if (existing) {
      return res.status(200).json({
        message: "Already pulsed",
        pulse: existing,
      });
    }

    const { data: pulse, error: createError } = await supabase
      .from("pulses")
      .insert([
        {
          fragment_id: id,
          pulsed_by: pulsed_by,
          pulsed_at: new Date(),
        },
      ])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    res.status(201).json({
      pulse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getFragments, dropFragment, retireFragment, pulseFragment };
