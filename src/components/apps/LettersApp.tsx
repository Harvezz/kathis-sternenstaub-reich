import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { letters } from "@/data/content";
import { dayIndex, todayKey } from "@/lib/daily";

export function LettersApp() {
  const [opened, setOpened] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOpened(localStorage.getItem("kathi-letter-" + todayKey()) === "1");
    setReady(true);
  }, []);

  const idx = dayIndex() % letters.length;
  const letter = letters[idx];
  const archive = Array.from({ length: Math.min(dayIndex(), 6) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    return { date: d.toLocaleDateString("de-DE", { day: "numeric", month: "long" }), letter: letters[(dayIndex(d)) % letters.length] };
  });

  const open = () => {
    localStorage.setItem("kathi-letter-" + todayKey(), "1");
    setOpened(true);
  };

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">Der tägliche Brief</h2>
      <p className="mt-1 text-sm text-muted-foreground">Jeden Tag ein neuer. Nur einmal alle 24 Stunden.</p>

      <div className="mt-8 flex justify-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key="envelope"
              onClick={open}
              exit={{ scale: 1.1, opacity: 0, transition: { duration: 0.5 } }}
              whileHover={{ scale: 1.04, rotate: -1 }}
              className="relative flex h-48 w-72 flex-col items-center justify-center rounded-xl bg-[oklch(0.93_0.02_85)] shadow-2xl"
            >
              <div
                className="absolute top-0 h-0 w-0 border-t-[70px] border-r-[144px] border-l-[144px] border-t-[oklch(0.88_0.03_85)] border-r-transparent border-l-transparent"
              />
              <motion.span
                className="relative z-10 mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.45_0.16_25)] text-2xl shadow-lg"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💜
              </motion.span>
              <span className="relative z-10 mt-3 font-hand text-2xl text-[oklch(0.3_0.03_300)]">Für Kathi · Heute öffnen</span>
            </motion.button>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full rounded-xl bg-[oklch(0.95_0.015_85)] p-7 text-[oklch(0.25_0.02_300)] shadow-2xl"
              style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, oklch(0.85 0.02 85) 28px)" }}
            >
              <span className="text-xs font-semibold tracking-widest text-[oklch(0.5_0.1_300)] uppercase">{letter.topic}</span>
              <p className="mt-3 font-hand text-2xl leading-[28px] whitespace-pre-line">{letter.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {archive.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Archiv</h3>
          <ul className="mt-3 space-y-2">
            {archive.map((a) => (
              <li key={a.date} className="glass rounded-xl px-4 py-3 text-sm">
                <span className="font-medium text-primary">{a.date}</span>
                <span className="ml-2 text-muted-foreground">{a.letter.topic}</span>
                <p className="mt-1 line-clamp-2 text-muted-foreground/80">{a.letter.text.split("\n\n")[1]}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
