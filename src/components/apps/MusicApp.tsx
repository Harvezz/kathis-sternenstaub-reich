import { motion } from "motion/react";
import { useState } from "react";
import { ExternalLink, Music } from "lucide-react";
import { songs } from "@/data/content";

export function MusicApp() {
  const [current, setCurrent] = useState<number | null>(null);

  const openSpotify = (i: number) => {
    setCurrent(i);
    const q = encodeURIComponent(`${songs[i].title} ${songs[i].artist}`);
    window.open(`https://open.spotify.com/search/${q}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">Music Room</h2>
      <p className="mt-1 text-sm text-muted-foreground">Der Soundtrack von allem. Klick öffnet den Song auf Spotify.</p>

      <div className="mt-8 flex items-center justify-center">
        <motion.div
          className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[oklch(0.12_0.02_300)] shadow-[var(--shadow-glow)]"
          animate={current !== null ? { rotate: 360 } : { rotate: 0 }}
          transition={current !== null ? { duration: 6, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
        >
          <div className="absolute inset-4 rounded-full border border-foreground/10" />
          <div className="absolute inset-8 rounded-full border border-foreground/10" />
          <div className="absolute inset-12 rounded-full border border-foreground/10" />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Music className="h-6 w-6" />
          </div>
        </motion.div>
      </div>
      <p className="mt-4 text-center font-serif text-lg italic text-foreground/80">
        {current !== null ? `♪ ${songs[current].title} – ${songs[current].artist}` : "Wähle einen Song"}
      </p>

      <ul className="mt-6 space-y-2">
        {songs.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <button
              onClick={() => openSpotify(i)}
              className={`glass flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all hover:scale-[1.01] ${current === i ? "ring-1 ring-primary" : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                <ExternalLink className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{s.title}</span>
                <span className="block text-xs text-muted-foreground">{s.artist}</span>
              </span>
              <span className="font-hand text-lg text-primary">{s.note}</span>
            </button>
          </motion.li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs text-muted-foreground/60">Öffnet Spotify in einem neuen Tab.</p>
    </div>
  );
}
