import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { morningMessages, nightMessages, comfortMessages, smileItems } from "@/data/content";
import { dailyPick, dayIndex, randomPick } from "@/lib/daily";

function DailyMessage({ title, sub, pool, salt, accent }: { title: string; sub: string; pool: string[]; salt: number; accent: string }) {
  const msg = dailyPick(pool, salt);
  const archive = Array.from({ length: Math.min(dayIndex(), 5) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    return { date: d.toLocaleDateString("de-DE", { day: "numeric", month: "short" }), msg: dailyPick(pool, salt, d) };
  });

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="glass mt-8 rounded-3xl p-7 text-center"
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        <span className="text-4xl">{accent}</span>
        <p className="mt-4 font-serif text-xl leading-relaxed">{msg}</p>
        <p className="mt-4 text-xs tracking-widest text-muted-foreground uppercase">Nachricht des Tages · morgen gibt es eine neue</p>
      </motion.div>
      {archive.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Vergangene Tage</h3>
          <ul className="mt-3 space-y-2">
            {archive.map((a) => (
              <li key={a.date} className="glass rounded-xl px-4 py-3 text-sm text-muted-foreground">
                <span className="font-medium text-primary">{a.date}:</span> {a.msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function MorningApp() {
  return <DailyMessage title="Guten Morgen" sub="Jeden Tag eine neue Nachricht. Für immer anders." pool={morningMessages} salt={1} accent="☀️" />;
}

export function NightApp() {
  return <DailyMessage title="Gute Nacht" sub="Der Mond hat eine Nachricht für dich." pool={nightMessages} salt={2} accent="🌙" />;
}

function ClickGenerator({ title, sub, buttonLabel, pool, accent }: { title: string; sub: string; buttonLabel: string; pool: string[]; accent: string }) {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center text-center">
      <h2 className="font-hand text-4xl text-primary">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <motion.button
        onClick={() => setMsg(randomPick(pool, msg ?? undefined))}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="mt-8 flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <Sparkles className="h-4 w-4" /> {buttonLabel}
      </motion.button>
      <div className="mt-8 min-h-32 w-full">
        <AnimatePresence mode="wait">
          {msg && (
            <motion.div
              key={msg}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="glass rounded-3xl p-7"
            >
              <span className="text-3xl">{accent}</span>
              <p className="mt-3 font-serif text-xl leading-relaxed">{msg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SmileApp() {
  return <ClickGenerator title="Daily Smile" sub="Garantiert mindestens ein Mundwinkel nach oben." buttonLabel="Bring mich zum Lächeln" pool={smileItems} accent="😊" />;
}

export function ComfortApp() {
  return <ClickGenerator title="Trost" sub="Für die Tage, die sich schwer anfühlen." buttonLabel="Ich habe einen schweren Tag" pool={comfortMessages} accent="🫂" />;
}
