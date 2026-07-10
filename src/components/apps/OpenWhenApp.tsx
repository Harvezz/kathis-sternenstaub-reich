import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { openWhen } from "@/data/content";

export function OpenWhenApp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <h2 className="font-hand text-4xl text-primary">Öffne, wenn…</h2>
      <p className="mt-1 text-sm text-muted-foreground">Für jeden Moment der richtige Umschlag.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {openWhen.map((l, i) => (
          <motion.button
            key={l.title}
            onClick={() => setOpen(open === i ? null : i)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className={`glass rounded-2xl p-5 text-left transition-all ${open === i ? "ring-1 ring-primary" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{l.emoji}</span>
              <h3 className="font-semibold">Öffne, wenn {l.title}</h3>
            </div>
            <AnimatePresence>
              {open === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-3 overflow-hidden font-serif text-base leading-relaxed text-muted-foreground italic"
                >
                  {l.text}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
