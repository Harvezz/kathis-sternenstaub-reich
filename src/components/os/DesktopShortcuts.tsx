import { motion } from "motion/react";
import type { AppDef } from "@/components/os/apps";

interface Props {
  apps: AppDef[];
  onOpen: (id: string) => void;
}

export function DesktopShortcuts({ apps, onOpen }: Props) {
  return (
    <div className="pointer-events-auto absolute top-14 left-4 z-10 grid max-h-[70vh] grid-flow-col grid-rows-6 gap-x-2 gap-y-3 md:left-6">
      {apps.map((app, i) => (
        <motion.button
          key={app.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.04 }}
          onDoubleClick={() => onOpen(app.id)}
          onClick={(e) => {
            // Mobile / single-tap friendly: open on click too
            if (window.matchMedia("(pointer: coarse)").matches || e.detail === 1) onOpen(app.id);
          }}
          className="group flex w-20 flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-center transition hover:bg-[oklch(1_0_0/8%)] focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label={app.title}
        >
          <span className="glass-strong flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-lg group-hover:scale-110 transition-transform">
            {app.emoji}
          </span>
          <span className="max-w-[80px] truncate text-[11px] font-medium text-foreground/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {app.title}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
