import { motion } from "motion/react";
import { timeline } from "@/data/content";

export function StoryApp() {
  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">Unsere Geschichte</h2>
      <p className="mt-1 text-sm text-muted-foreground">Eine Timeline, die immer weiterwächst.</p>
      <div className="relative mt-8 border-l border-primary/30 pl-8">
        {timeline.map((e, i) => (
          <motion.div
            key={e.date}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="relative mb-10 last:mb-2"
          >
            <span className="absolute -left-[2.6rem] flex h-9 w-9 items-center justify-center rounded-full bg-accent text-lg shadow-[var(--shadow-glow)]">
              {e.emoji}
            </span>
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">{e.date}</span>
            <h3 className="mt-1 font-serif text-2xl">{e.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
