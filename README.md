# Void

> *you were not supposed to find this. but here you are.*

Void is a living social experience not a social media app, not a game. Something in between. A dark, infinite sky where strangers leave fragments of themselves. No likes. No followers. No comments. Just presence and gravity.

![Status](https://img.shields.io/badge/status-in%20development-8B5CF6?style=flat-square)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite%20%2B%20TypeScript-2D5BFF?style=flat-square)
![Backend](https://img.shields.io/badge/backend-Node%20%2B%20Express-4FD1C5?style=flat-square)
![Database](https://img.shields.io/badge/database-Supabase%20%2B%20PostgreSQL-1A1B4B?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-FFD36E?style=flat-square)

---

## ✦ What is Void

Every user is assigned a **signal** a unique identity generated on signup. A color. A frequency. A shape. You never choose it.

You enter the void  a dark infinite canvas. You drop **fragments** unfinished thoughts, feelings, half-sentences. They drift slowly across the sky on their own.

When two fragments drift close enough, the void draws a **constellation** between them. You never chose that connection. The sky did.

Every few hours, one fragment **rises** seen by everyone in the void for a moment. Then it sinks back into the dark.

You can **pulse** a fragment. The owner feels it. No name. No count. Just warmth.

---

## ✦ Core Mechanics

| Mechanic | Description |
|----------|-------------|
|  **Signal** | Auto-generated identity on signup. Permanent. Never changed. |
|  **Fragment** | A thought you drop into the void. It drifts on its own. |
|  **Constellation** | Auto-formed when two fragments drift close. Named by the void. |
|  **Pulse** | One silent reaction per fragment. Private. No count shown. |
|  **The Carousel** | One fragment rises every few hours. Seen by all. Then gone. |
|  **Ghost** | Retired fragments don't disappear. They become faded, drifting ghosts. |
|  **Grove** | Your personal space. Not a profile. Shows your fragments, constellations, ghosts. |

---

## ✦ What You Cannot Do

-  Search for people
-  Follow anyone
-  Comment
-  See who pulsed you
-  Go viral
-  Curate your feed

---

## ✦ Tech Stack

### Frontend
- React + Vite + TypeScript
- Plain CSS with CSS variables
- React Router DOM (HashRouter)
- Axios with JWT interceptor
- Phosphor Icons
- @use-gesture/react

### Backend
- Node.js + Express
- Supabase + PostgreSQL
- Supabase Realtime
- JWT Authentication
- bcryptjs
- node-cron (drift + carousel schedulers)

---

## ✦ Project Structure
Void/
Backend/
Controllers/
Routes/
Middleware/
lib/
crons/
db/
schema.sql
server.js
app.js
Frontend/
src/
Pages/
components/
hooks/
lib/
styles/

---

## ✦ Getting Started

### Prerequisites
- Node.js v18+
- Supabase account (free tier)

### Backend

```bash
cd Backend
npm install
```

Create `.env`:
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret

Run your `db/schema.sql` in Supabase SQL Editor, then:

```bash
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
```

Create `.env`:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_publishable_key
VITE_API_URL=http://localhost:5000/api

```bash
npm run dev
```

---

## ✦ Database Schema

- `users` — signal identity, email, hashed password
- `fragments` — content, temperature, x/y coordinates, status
- `constellations` — pairs of fragments connected by proximity
- `pulses` — one per user per fragment
- `carousel_events` — risen fragment log with start and end times

---

## ✦ Aesthetic

> museum × forest × cosmos × quiet sci-fi diary

Colors: deep void blues, nebula purples, warm star golds, teal resonance
Typography: Playfair Display · Space Mono · Orbitron · Space Grotesk

---

## ✦ Inspiration

-  *Void* by Melanie Martinez
-  Son Daven, Steven.com (awwwards)
-  Sky: Children of the Light

---

## ✦ Status

> actively building. fragments are drifting.

- [x] Backend — auth, fragments, constellations, grove, carousel, crons
- [x] Landing page
- [x] Register page
- [ ] Login page
- [ ] Void canvas
- [ ] Grove page
- [ ] Realtime integration
- [ ] Mobile experience
- [ ] Deployment

---

*built in the dark. for the ones who drift.*
