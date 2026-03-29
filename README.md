# Maher Bhatt | 3D Portfolio

An immersive, single-world 3D personal portfolio built with React + Vite, Three.js via React Three Fiber, GSAP ScrollTrigger, and Framer Motion.

## Stack

- React + Vite
- Three.js (`@react-three/fiber`, `@react-three/drei`)
- GSAP + ScrollTrigger (scroll-driven camera flight)
- Framer Motion (overlay and modal animations)
- Google Fonts
- Vercel deployment ready

## Scene Architecture

The entire experience lives inside one continuous 3D scene:

1. Hero: extruded metallic `MAHER` sculpture with orbiting geometry
2. About: floating island + holographic panel and orbiting stat counters
3. Projects: suspended 3D gallery cards with physical 180deg flips and click focus
4. Skills: orbital solar-system of skill spheres around a glowing core
5. Agency: extruded `Velocity Web` logo reveal + portal effect
6. Contact: glowing terminal monolith + particle burst interaction

Global behavior:

- Scroll drives a cinematic camera path using GSAP ScrollTrigger
- Mouse adds persistent parallax to camera and scene feel
- Ambient particles run throughout the world
- Mobile auto-reduces particle count and geometry complexity
- Loading overlay uses Drei progress + Framer Motion

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.

`vercel.json` is included for SPA routing.
