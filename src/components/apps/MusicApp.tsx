import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Music, Search, ExternalLink } from "lucide-react";
import { songs } from "@/data/content";

// Spotify Web API 'search' iframe embed – autoplays the top result in-page.
// We use the "search" embed which is public and needs no key.
function embedUrl(q: string) {
  return `https://open.spotify.com/embed/search/${encodeURIComponent(q)}?utm_source=generator&theme=0`;
}

export function MusicApp() {
  const [current, setCurrent] = useState<number>(songs.length - 1); // start with "unser Song"
  const [manualQuery, setManualQuery] = useState("");
  const activeQuery = useMemo(
    () => (manualQuery.trim() ? manualQuery.trim() : `${songs[current].title} ${songs[current].artist}`),
    [manualQuery, current],
  );

  useEffect(() => setManualQuery(""), [current]);

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">Music Room</h2>
      <p className="mt-1 text-sm text-muted-foreground">Der Soundtrack – direkt hier abgespielt. Wähle einen Song oder suche.</p>

      <div className="mt-6 flex items-center justify-center">
        <motion.div
          className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[oklch(0.12_0.02_300)] shadow-[var(--shadow-glow)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-4 rounded-full border border-foreground/10" />
          <div className="absolute inset-8 rounded-full border border-foreground/10" />
          <div className="absolute inset-12 rounded-full border border-foreground/10" />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Music className="h-6 w-6" />
          </div>
        </motion.div>
      </div>

      <div className="glass mt-6 flex items-center gap-2 rounded-2xl px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={manualQuery}
          onChange={(e) => setManualQuery(e.target.value)}
          placeholder={`Suche… (aktuell: ${songs[current].title})`}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl shadow-lg">
        <iframe
          key={activeQuery}
          title="Spotify"
          src={embedUrl(activeQuery)}
          width="100%"
          height="152"
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      <ul className="mt-6 space-y-2">
        {songs.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <button
              onClick={() => setCurrent(i)}
              className={`glass flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all hover:scale-[1.01] ${current === i ? "ring-1 ring-primary" : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                {current === i ? <Music className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
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
      <p className="mt-3 text-center text-xs text-muted-foreground/60">
        Spotify Player. Kurze Vorschau ohne Login, volle Songs mit Spotify-Konto.
      </p>
    </div>
  );
}
