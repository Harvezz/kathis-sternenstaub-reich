import { motion } from "motion/react";
import { useEffect } from "react";
import { Starfield } from "@/components/effects/Starfield";

export function IntroSequence({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 9000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 cursor-pointer bg-[oklch(0.08_0.02_300)]"
      onClick={onDone}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="absolute inset-0">
        <Starfield density={180} fadeIn shooting />
      </div>
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          className="font-hand text-7xl text-foreground glow-text md:text-9xl"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 2.5, duration: 2.5, ease: "easeOut" }}
        >
          Für Kathi
        </motion.h1>
        <motion.p
          className="mt-6 max-w-md font-serif text-lg italic text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.5, duration: 2 }}
        >
          Ein Ort, gebaut aus Erinnerungen, Dankbarkeit und den kleinen Dingen, die das Leben heller gemacht haben.
        </motion.p>
        <motion.span
          className="absolute bottom-10 text-xs tracking-widest text-muted-foreground/60 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ delay: 6, duration: 3, repeat: Infinity }}
        >
          Tippen zum Fortfahren
        </motion.span>
      </div>
    </motion.div>
  );
}
