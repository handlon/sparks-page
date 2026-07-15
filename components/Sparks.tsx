"use client";

import { useEffect, useRef } from "react";

/* Ambient ember field — the literal "spark" in Young Sparks.

   A fixed, transparent canvas of sparse cyan embers drifting upward and twinkling.
   It uses mix-blend-mode: screen, so it can sit ON TOP of the whole page and only
   ever ADD light — an ember passing over text brightens by a hair, never darkens or
   obscures it. Paused when the tab is hidden and when reduced-motion is requested. */

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  hot: boolean;
  tw: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function Sparks() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let mobile = false;
    let embers: Ember[] = [];
    let raf = 0;
    let last = 0;

    // Sparse, and sparser still on phones where content is full-width and every ember
    // sits right over the text. A bigger divisor = fewer embers per screen.
    const targetCount = () => {
      if (reduce) return 5;
      const density = mobile ? 110000 : 68000;
      const cap = mobile ? 9 : 24;
      const floor = mobile ? 4 : 8;
      const n = Math.round((width * height) / density);
      return Math.max(floor, Math.min(cap, n));
    };

    const make = (seeded: boolean): Ember => ({
      x: rand(0, width),
      y: seeded ? rand(0, height) : height + rand(0, 60),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.7, -0.25), // negative = rising
      r: rand(0.5, 1.6), // smaller than before, so they read as embers not orbs
      life: seeded ? rand(0, 4000) : 0,
      maxLife: rand(4200, 9000),
      hot: Math.random() < 0.22, // a fifth burn white-hot
      tw: rand(0, Math.PI * 2),
    });

    // How lit the whole field is, by scroll position. Full over the hero (top of page),
    // easing down to a quiet floor once the content starts — the field was pulling the
    // eye away from real content once the hero settled, especially on mobile.
    const scrollLevel = () => {
      const floor = mobile ? 0.16 : 0.32;
      const t = Math.min(window.scrollY / (height * 0.85), 1);
      return 1 - t * (1 - floor);
    };

    const draw = (e: Ember, alpha: number) => {
      const rgb = e.hot ? "200,238,255" : "39,181,240";
      const radius = e.r * 3.4;
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, radius);
      g.addColorStop(0, `rgba(${rgb},${alpha})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Fall back off innerWidth so a transient 0 (e.g. a backgrounded tab at mount)
      // never collapses every ember onto x=0.
      width = window.innerWidth || document.documentElement.clientWidth || 1280;
      height = window.innerHeight || document.documentElement.clientHeight || 800;
      mobile = width < 640;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      embers = Array.from({ length: targetCount() }, () => make(true));
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, width, height);

      // Scroll dims the whole layer; applied on the canvas so it costs nothing per ember.
      canvas.style.opacity = scrollLevel().toFixed(3);

      for (const e of embers) {
        e.life += dt;
        e.x += e.vx * (dt / 16);
        e.y += e.vy * (dt / 16);
        e.tw += dt * 0.004;

        if (e.y < -20 || e.life > e.maxLife) {
          Object.assign(e, make(false));
          continue;
        }

        // Fade in then out across the ember's life, with a gentle twinkle on top.
        // Lower peak alphas than before, so the field stays quiet under text.
        const fade = Math.sin(Math.min(e.life / e.maxLife, 1) * Math.PI);
        const twinkle = 0.55 + 0.45 * Math.sin(e.tw);
        draw(e, Math.max(0, fade * twinkle) * (e.hot ? 0.5 : 0.28));
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => cancelAnimationFrame(raf);

    resize();

    if (reduce) {
      // One static frame of faint embers — a hint of the effect, no animation.
      canvas.style.opacity = mobile ? "0.5" : "0.7";
      ctx.clearRect(0, 0, width, height);
      for (const e of embers) draw(e, 0.28);
    } else {
      start();
    }

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) stop();
      else start();
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] mix-blend-screen"
    />
  );
}
