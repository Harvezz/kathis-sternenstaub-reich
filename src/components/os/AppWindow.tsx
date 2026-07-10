import { motion } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";
import { X, Minus, Maximize2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppWindowProps {
  title: string;
  emoji: string;
  z: number;
  maximized: boolean;
  index: number;
  containerRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onFocus: () => void;
  children: ReactNode;
}

export function AppWindow({
  title,
  emoji,
  z,
  maximized,
  index,
  containerRef,
  onClose,
  onMinimize,
  onToggleMax,
  onFocus,
  children,
}: AppWindowProps) {
  const isMobile = useIsMobile();
  const full = maximized || isMobile;
  const offset = useRef({ x: 40 + (index % 5) * 36, y: 30 + (index % 4) * 28 });

  return (
    <motion.div
      drag={!full}
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.05}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 40 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      style={{ zIndex: z }}
      className={
        full
          ? "absolute inset-2 flex flex-col overflow-hidden rounded-3xl md:inset-6"
          : "absolute flex h-[min(70vh,560px)] w-[min(92vw,680px)] flex-col overflow-hidden rounded-3xl"
      }
    >
      <div
        className="glass-strong flex h-full flex-col rounded-3xl"
        style={{ boxShadow: "var(--shadow-window)", marginLeft: full ? 0 : offset.current.x, marginTop: full ? 0 : offset.current.y }}
      >
        <div className="flex cursor-grab items-center gap-3 border-b border-border px-4 py-3 active:cursor-grabbing">
          <div className="flex gap-2">
            <button onClick={onClose} aria-label="Schließen" className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[oklch(0.65_0.2_25)]">
              <X className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-80" />
            </button>
            <button onClick={onMinimize} aria-label="Minimieren" className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[oklch(0.8_0.15_85)]">
              <Minus className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-80" />
            </button>
            <button onClick={onToggleMax} aria-label="Vollbild" className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[oklch(0.7_0.17_150)]">
              <Maximize2 className="h-2 w-2 opacity-0 transition-opacity group-hover:opacity-80" />
            </button>
          </div>
          <span className="flex-1 text-center text-sm font-medium text-foreground/80">
            {emoji} {title}
          </span>
          <span className="w-14" />
        </div>
        <div className="flex-1 overflow-y-auto p-5 md:p-6">{children}</div>
      </div>
    </motion.div>
  );
}
