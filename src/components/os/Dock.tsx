import { motion } from "motion/react";
import type { AppDef } from "@/components/os/apps";

interface DockProps {
  apps: AppDef[];
  openIds: string[];
  onOpen: (id: string) => void;
}

export function Dock({ apps, openIds, onOpen }: DockProps) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 22 }}
      className="pointer-events-auto glass-strong fixed bottom-3 left-1/2 z-30 flex max-w-[96vw] -translate-x-1/2 items-end gap-1 overflow-x-auto rounded-3xl px-3 py-2.5 md:gap-1.5"
      style={{ boxShadow: "var(--shadow-glow)" }}
    >
      {apps.map((app) => (
        <motion.button
          key={app.id}
          onClick={() => onOpen(app.id)}
          whileHover={{ scale: 1.25, y: -8 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/50 text-2xl md:h-12 md:w-12"
          aria-label={app.title}
        >
          {app.emoji}
          <span className="pointer-events-none absolute -top-9 hidden rounded-lg bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-lg group-hover:block">
            {app.title}
          </span>
          {openIds.includes(app.id) && (
            <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-primary" />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}
