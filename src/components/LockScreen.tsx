import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronUp, Cloud } from "lucide-react";
import wallpaper from "@/assets/wallpaper-night.jpg";
import { Starfield } from "@/components/effects/Starfield";
import { formatDateDE } from "@/lib/daily";

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const time = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden"
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.3, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -80) onUnlock();
      }}
    >
      <img src={wallpaper} alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[oklch(0.1_0.03_300/60%)]" />
      <div className="absolute inset-0">
        <Starfield density={80} fireflies />
      </div>

      <div className="relative flex h-full flex-col items-center pt-[18vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-foreground/70">
            <Cloud className="h-4 w-4" /> <span>Klarer Nachthimmel · 12°</span>
          </div>
          <div className="mt-2 text-[5.5rem] leading-none font-extralight tracking-tight text-foreground md:text-[7rem]">
            {time}
          </div>
          <div className="mt-2 text-lg text-foreground/80 capitalize">{formatDateDE(now)}</div>
        </motion.div>

        <motion.button
          onClick={onUnlock}
          className="absolute bottom-10 flex flex-col items-center gap-1 text-foreground/70"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronUp className="h-6 w-6" />
          <span className="text-xs tracking-widest uppercase">Nach oben wischen</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
