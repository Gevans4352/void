const cron = require("node-cron");
const supabase = require("../lib/supabase");
const generateConstellationName = () => {
  const prefixes = [
    "Ash",
    "Void",
    "Drift",
    "Ember",
    "Frost",
    "Moss",
    "Cedar",
    "Dusk",
    "Pine",
    "Oak",
  ];
  const suffixes = [
    "veil",
    "line",
    "fall",
    "core",
    "bloom",
    "haze",
    "shade",
    "glow",
    "borne",
    "root",
  ];
  const frequency = Math.floor(Math.random() * 900) + 100;
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${suffix} · ${frequency}hz`;
};

 const startCarouselCron = () => {
    cron.schedule("0 */3 * * *", async () => {
      console.log("Running carousel cron...");
      await supabase
        .from("fragments")
        .update({ status: "active" })
        .eq("status", "risen");

      const { data: fragments, error } = await supabase
        .from("fragments")
        .select("id")
        .eq("status", "active");

      if (error || !fragments || fragments.length === 0) {
        console.log("No fragment to rise");
        return;
      }

      const chosen = fragments[Math.floor(Math.random() * fragments.length)];
      const now = new Date();
      const endsAt = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      await supabase
        .from("fragments")
        .update({ status: "risen" })
        .eq("id", chosen.id);

      await supabase.from("carousel_events").insert([
        {
          fragment_id: chosen.id,
          started_at: now.toISOString(),
          ends_at: endsAt.toISOString(),
        },
      ]);
      console.log(`Fragment ${chosen.id} has risen`);
    });
  };

const checkConstellation = async (fragmentId, x, y) => {
  const PROXIMITY_THRESHOLD = 50;
  const createdConstellations = [];

 

  try {
    const { data: nearbyFragments, error: nearbyError } = await supabase
      .from("fragments")
      .select("id")
      .neq("id", fragmentId)
      .eq("status", "active")
      .gte("x", x - PROXIMITY_THRESHOLD)
      .lte("x", x + PROXIMITY_THRESHOLD)
      .gte("y", y - PROXIMITY_THRESHOLD)
      .lte("y", y + PROXIMITY_THRESHOLD);

    if (nearbyError) {
      console.error("Error finding nearby fragments:", nearbyError);
      return {
        success: false,
        error: nearbyError,
        constellation: [],
      };
    }

    if (!nearbyFragments || nearbyFragments.length === 0) {
      return {
        success: true,
        constellation: [],
        message: "No nearby fragments found",
      };
    }
    for (const nearby of nearbyFragments) {
      try {
        const { data: existing, error: existingError } = await supabase
          .from("constellations")
          .select("id")
          .or(
            `
                    and(fragment_a_id.eq.${fragmentId}, fragment_b_id.eq.${nearby.id}),` +
              `
                    and(fragment_a_id.eq.${nearby.id}, fragment_b_id.eq.${fragmentId})
                    `,
          )
          .maybeSingle();

        if (existingError) {
          console.error("Error checking existing constellation", existingError);
          continue;
        }

        if (existing) {
          continue;
        }

        const generatedName = generateConstellationName();

        const { data: newConstellation, error: insertError } = await supabase
          .from("constellations")
          .insert([
            {
              fragment_a_id: fragmentId,
              fragment_b_id: nearby.id,
              generated_name: generatedName,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating constellation", insertError);
          continue;
        }

        createdConstellations.push(newConstellation);
      } catch (error) {
        console.error(`Error processing fragment ${nearby.id}:`, error);
      }
    }

    return {
      success: true,
      constellation: createdConstellations,
      count: createdConstellations.length,
    };
  } catch (error) {
    console.error("Unexpected error in checkConstellation:", error);
    return {
      success: false,
      error: error.message,
      constellation: [],
    };
  }
};
const startDriftCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running drift cron...");

    const { data: fragments, error } = await supabase
      .from("fragments")
      .select("id, x, y")
      .eq("status", "active");

    if (error) {
      console.log("Drift cron error:", error);
      return;
    }

    for (const fragment of fragments) {
      const newX = fragment.x + (Math.random() - 0.5) * 10;
      const newY = fragment.y + (Math.random() - 0.5) * 10;

      await supabase
        .from("fragments")
        .update({
          x: newX,
          y: newY,
        })
        .eq("id", fragment.id);
      await checkConstellation(fragment.id, newX, newY);
    }
  });
};

module.exports = { startDriftCron, startCarouselCron };
