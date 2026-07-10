import { useEffect, useRef } from "react";

interface StarfieldProps {
  density?: number;
  shooting?: boolean;
  fireflies?: boolean;
  className?: string;
  fadeIn?: boolean;
}

/** Canvas-Sternenhimmel mit Sternschnuppen und Glühwürmchen. */
export function Starfield({ density = 140, shooting = true, fireflies = false, className, fadeIn = false }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio);

    const stars = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.85,
      r: Math.random() * 1.4 * devicePixelRatio + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.2,
    }));

    const flies = fireflies
      ? Array.from({ length: 14 }, () => ({
          x: Math.random() * w,
          y: h * (0.6 + Math.random() * 0.35),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.3,
          phase: Math.random() * Math.PI * 2,
        }))
      : [];

    let meteor: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextMeteor = performance.now() + 3000 + Math.random() * 5000;
    let start = performance.now();
    let raf = 0;

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    window.addEventListener("resize", onResize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const globalFade = fadeIn ? Math.min(1, (t - start) / 4000) : 1;

      for (const s of stars) {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + (t / 1000) * s.speed));
        ctx.globalAlpha = tw * globalFade;
        ctx.fillStyle = "#e9dfff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (shooting) {
        if (!meteor && t > nextMeteor) {
          meteor = {
            x: Math.random() * w * 0.7 + w * 0.2,
            y: Math.random() * h * 0.25,
            vx: -(4 + Math.random() * 4) * devicePixelRatio,
            vy: (2 + Math.random() * 2) * devicePixelRatio,
            life: 1,
          };
          nextMeteor = t + 6000 + Math.random() * 9000;
        }
        if (meteor) {
          meteor.x += meteor.vx;
          meteor.y += meteor.vy;
          meteor.life -= 0.02;
          if (meteor.life <= 0) meteor = null;
          else {
            const grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 12, meteor.y - meteor.vy * 12);
            grad.addColorStop(0, `rgba(240,230,255,${meteor.life})`);
            grad.addColorStop(1, "rgba(240,230,255,0)");
            ctx.globalAlpha = globalFade;
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5 * devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(meteor.x - meteor.vx * 12, meteor.y - meteor.vy * 12);
            ctx.stroke();
          }
        }
      }

      for (const f of flies) {
        f.x += f.vx + Math.sin(t / 900 + f.phase) * 0.3;
        f.y += f.vy + Math.cos(t / 1100 + f.phase) * 0.2;
        if (f.x < 0) f.x = w;
        if (f.x > w) f.x = 0;
        const glow = 0.3 + 0.7 * Math.abs(Math.sin(t / 700 + f.phase));
        ctx.globalAlpha = glow * globalFade;
        ctx.fillStyle = "#ffe9a3";
        ctx.shadowColor = "#ffd76b";
        ctx.shadowBlur = 8 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 1.6 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density, shooting, fireflies, fadeIn]);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} aria-hidden />;
}
