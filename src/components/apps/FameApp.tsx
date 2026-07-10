import { motion } from "motion/react";
import { trophies } from "@/data/content";

export function FameApp() {
  return (
    <div>
      <h2 className="font-hand text-4xl text-primary">Hall of Fame</h2>
      <p className="mt-1 text-sm text-muted-foreground">Jede schöne Erinnerung ist eine Auszeichnung.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {trophies.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="glass group relative overflow-hidden rounded-3xl p-5 text-center"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.85 0.13 88 / 20%), transparent 70%)" }} />
            <motion.span
              className="inline-block text-4xl drop-shadow-[0_0_14px_oklch(0.85_0.13_88/60%)]"
              whileHover={{ rotate: [0, -12, 12, 0], transition: { duration: 0.5 } }}
            >
              🏆
            </motion.span>
            <div className="mt-2 text-2xl">{t.emoji}</div>
            <h3 className="mt-2 font-semibold text-gold">{t.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
