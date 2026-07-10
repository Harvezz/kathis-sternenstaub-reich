import { useEffect, useRef } from "react";

export type WeatherMode = "clear" | "rain" | "snow";

/** Regen- / Schnee-Overlay als Canvas. */
export function Precipitation({ mode }: { mode: WeatherMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === "clear") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio);

    const count = mode === "rain" ? 160 : 90;
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      v: mode === "rain" ? 8 + Math.random() * 8 : 0.6 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * (mode === "snow" ? 0.8 : 0.2),
      size: mode === "rain" ? 8 + Math.random() * 10 : 1.5 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += p.v * devicePixelRatio;
        p.x += (p.drift + (mode === "snow" ? Math.sin(t / 1000 + p.phase) * 0.4 : 0)) * devicePixelRatio;
        if (p.y > h) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (mode === "rain") {
          ctx.strokeStyle = "rgba(190,180,230,0.35)";
          ctx.lineWidth = 1 * devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1.5 * devicePixelRatio, p.y + p.size * devicePixelRatio);
          ctx.stroke();
        } else {
          ctx.fillStyle = "rgba(245,240,255,0.7)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * devicePixelRatio * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [mode]);

  if (mode === "clear") return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-40" style={{ width: "100%", height: "100%" }} aria-hidden />;
}
