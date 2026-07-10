import { motion } from "motion/react";
import { littleThings } from "@/data/content";

export function ThingsApp() {
  return (
    <div>
      <h2 className="font-hand text-4xl text-primary">Kleine Dinge, die mir aufgefallen sind</h2>
      <p className="mt-1 text-sm text-muted-foreground">Weil die kleinen Dinge die großen sind.</p>
      <div className="mt-8 columns-1 gap-4 sm:columns-2 md:columns-3">
        {littleThings.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? -1 : 1 }}
            className="glass mb-4 break-inside-avoid rounded-2xl p-5"
          >
            <span className="font-hand text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-1 text-sm leading-relaxed">{t}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
