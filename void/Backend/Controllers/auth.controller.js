const supabase = require("../lib/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateSignal = () => {
  const colors = [
    "Nebulamoss",
    "Orbitpine",
    "Starroot",
    "Ashgrove",
    "Frostgrove",
    "Mossshadow",
    "Oakember",
    "Cedarhaze",
    "Pinebloom",
    "Duskleaf",
    "Iceblue",
    "Goldburn",
    "Voidpurple",
    "Frostwhite",
    "Deeporbit",
    "Paleamber",
    "Coldstar",
  ];
  const shapes = [
    "ring",
    "pulse",
    "drift",
    "ember",
    "shard",
    "wave",
    "arc",
    "rindusk",
    "pulseveil",
    "driftcore",
    "emberglow",
    "shardfall",
    "waveborne",
    "arcline",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const frequency = Math.floor(Math.random() * 900) + 100;

  return {
    signal_name: `${color} . ${frequency}`,
    signal_color: color.toLowerCase(),
    signal_shape: shape,
    signal_frequency: `${frequency}hz`,
  };
};

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }
  try {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const signal = generateSignal();

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          ...signal,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        signal_name: newUser.signal_name,
        signal_color: newUser.signal_color,
        signal_shape: newUser.signal_shape,
        signal_frequency: newUser.signal_frequency,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        signal_name: user.signal_name,
        signal_color: user.signal_color,
        signal_shape: user.signal_shape,
        signal_frequency: user.signal_frequency,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { register, login };
