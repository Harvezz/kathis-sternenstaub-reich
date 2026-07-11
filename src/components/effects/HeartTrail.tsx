import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Heart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const EMOJIS = ["💜", "💫", "✨", "🌙", "🩷"];

export function HeartTrail() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    let id = 0;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Only fire on empty desktop area, not on buttons/inputs/iframes
      if (target?.closest("button, a, input, textarea, iframe, video, [role='dialog']")) return;
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const heart = { id: id++, x: e.clientX, y: e.clientY, emoji };
      setHearts((h) => [...h, heart]);
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== heart.id)), 1200);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, scale: 0.6, x: h.x - 12, y: h.y - 12 }}
            animate={{ opacity: 0, scale: 1.4, y: h.y - 80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute text-2xl"
          >
            {h.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
