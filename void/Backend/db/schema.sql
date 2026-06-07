CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    signal_name TEXT NOT NULL,
    signal_color TEXT NOT NULL,
    signal_frequency TEXT NOT NULL, 
    signal_shape TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fragment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    temperature TEXT CHECK (temperature IN ('warm', 'cold', 'burning', 'frozen')),
    x FLOAT DEFAULT 0,
    y FLOAT DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ghost', 'risen')),
    created_at TIMESTAMP DEFAULT NOW(),
    retired_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS constellations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fragment_a_id UUID REFERENCES fragment(id) ON DELETE CASCADE,
    fragment_b_id UUID REFERENCES fragment(id) ON DELETE CASCADE,
    generated_name TEXT NOT NULL,
    formed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pulses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fragment_id UUID REFERENCES fragment(id) ON DELETE CASCADE,
    pulsed_by UUID REFERENCES users(id) ON DELETE CASCADE,
    pulsed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(fragment_id, pulsed_by)
);

CREATE TABLE IF NOT EXISTS carousel_events(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fragment_id UUID REFERENCES fragment(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT NOW(),
    ends_at TIMESTAMP NOT NULL
)