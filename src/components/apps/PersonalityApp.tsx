import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { personality } from "@/data/content";

/** Feste, hübsch verteilte Sternpositionen (Prozent). */
const positions = [
  { x: 18, y: 22 }, { x: 42, y: 12 }, { x: 68, y: 20 }, { x: 85, y: 35 },
  { x: 72, y: 55 }, { x: 50, y: 45 }, { x: 28, y: 50 }, { x: 12, y: 68 },
  { x: 38, y: 78 }, { x: 65, y: 80 },
];

export function PersonalityApp() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-hand text-4xl text-primary">Dein Sternbild</h2>
      <p className="mt-1 text-sm text-muted-foreground">Jeder Stern ist ein Teil von dir. Tippe sie an.</p>

      <div className="relative mt-6 min-h-72 flex-1 overflow-hidden rounded-3xl bg-[oklch(0.11_0.03_300)]">
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          {positions.slice(0, -1).map((p, i) => {
            const n = positions[i + 1];
            return (
              <line
                key={i}
                x1={`${p.x}%`} y1={`${p.y}%`} x2={`${n.x}%`} y2={`${n.y}%`}
                stroke="oklch(0.74 0.15 302 / 25%)" strokeWidth="1"
              />
            );
          })}
        </svg>
        {personality.map((p, i) => (
          <motion.button
            key={p.trait}
            onClick={() => setActive(active === i ? null : i)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
            whileHover={{ scale: 1.3 }}
            aria-label={p.trait}
          >
            <motion.span
              className={`block h-3 w-3 rounded-full ${active === i ? "bg-gold" : "bg-primary"}`}
              animate={{ opacity: [0.5, 1, 0.5], boxShadow: ["0 0 6px oklch(0.74 0.15 302)", "0 0 18px oklch(0.74 0.15 302)", "0 0 6px oklch(0.74 0.15 302)"] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity }}
            />
            <span className="mt-1 block text-xs text-foreground/70">{p.trait}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 min-h-24">
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <h3 className="font-hand text-2xl text-gold">{personality[active].trait}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{personality[active].text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
