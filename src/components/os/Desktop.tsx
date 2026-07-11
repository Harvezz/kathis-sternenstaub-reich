import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import wallpaper from "@/assets/wallpaper-night.jpg";
import { Starfield } from "@/components/effects/Starfield";
import { Precipitation, type WeatherMode } from "@/components/effects/Precipitation";
import { WeatherContext } from "@/components/os/WeatherContext";
import { APPS } from "@/components/os/apps";
import { AppWindow } from "@/components/os/AppWindow";
import { Dock } from "@/components/os/Dock";
import { dailyPick, greetings, timeOfDay, formatDateDE } from "@/lib/daily";
import { floatingQuotes, littleThings } from "@/data/content";
import { DesktopShortcuts } from "@/components/os/DesktopShortcuts";
import { HeartTrail } from "@/components/effects/HeartTrail";

interface WinState {
  id: string;
  minimized: boolean;
  maximized: boolean;
  z: number;
  index: number;
}

export function Desktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windows, setWindows] = useState<WinState[]>([]);
  const [weather, setWeather] = useState<WeatherMode>("clear");
  const [now, setNow] = useState(() => new Date());
  const zRef = useRef(10);
  const idxRef = useRef(0);

  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * floatingQuotes.length));

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30000);
    const q = setInterval(
      () => setQuoteIdx((v) => (v + 1 + Math.floor(Math.random() * (floatingQuotes.length - 1))) % floatingQuotes.length),
      6000,
    );
    return () => {
      clearInterval(i);
      clearInterval(q);
    };
  }, []);

  const tod = timeOfDay(now);
  const quote = floatingQuotes[quoteIdx];
  const memoryOfDay = useMemo(() => dailyPick(littleThings, 9), []);

  const openApp = (id: string) => {
    setWindows((ws) => {
      const existing = ws.find((w) => w.id === id);
      if (existing) {
        return ws.map((w) => (w.id === id ? { ...w, minimized: false, z: ++zRef.current } : w));
      }
      return [...ws, { id, minimized: false, maximized: false, z: ++zRef.current, index: idxRef.current++ }];
    });
  };

  const update = (id: string, patch: Partial<WinState>) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const overlay =
    tod === "morning"
      ? "var(--gradient-morning)"
      : tod === "evening"
        ? "var(--gradient-evening)"
        : "transparent";

  return (
    <WeatherContext.Provider value={{ weather, setWeather }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="fixed inset-0 overflow-hidden"
      >
        <img src={wallpaper} alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: overlay }} />
        <div className="absolute inset-0 bg-[oklch(0.1_0.03_300/35%)]" />
        <div className="absolute inset-0">
          <Starfield density={100} fireflies={tod === "night" || tod === "evening"} />
        </div>

        {/* Top-Bar */}
        <div className="glass-strong absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-4 py-1.5 text-xs text-foreground/80">
          <span className="font-semibold">💜 Kathi OS</span>
          <span className="hidden font-hand text-base text-primary md:block">{quote}</span>
          <span className="capitalize">
            {formatDateDE(now)} · {now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Widgets */}
        {windows.filter((w) => !w.minimized).length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 pb-24 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-hand text-6xl text-foreground glow-text md:text-7xl"
            >
              {greetings[tod]}, Kathi
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="glass mt-8 max-w-md rounded-3xl p-5"
            >
              <span className="text-xs font-semibold tracking-widest text-primary uppercase">Erinnerung des Tages</span>
              <p className="mt-2 font-serif text-lg italic">{memoryOfDay}</p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Öffne eine App im Dock, um loszulegen ↓
            </motion.p>
          </div>
        )}

        {/* Fenster */}
        <div ref={containerRef} className="absolute inset-0 top-8 bottom-20">
          <AnimatePresence>
            {windows
              .filter((w) => !w.minimized)
              .map((w) => {
                const app = APPS.find((a) => a.id === w.id)!;
                const Comp = app.component;
                return (
                  <AppWindow
                    key={w.id}
                    title={app.title}
                    emoji={app.emoji}
                    z={w.z}
                    maximized={w.maximized}
                    index={w.index}
                    containerRef={containerRef}
                    onClose={() => setWindows((ws) => ws.filter((x) => x.id !== w.id))}
                    onMinimize={() => update(w.id, { minimized: true })}
                    onToggleMax={() => update(w.id, { maximized: !w.maximized })}
                    onFocus={() => update(w.id, { z: ++zRef.current })}
                  >
                    <Comp />
                  </AppWindow>
                );
              })}
          </AnimatePresence>
        </div>

        <Dock apps={APPS} openIds={windows.map((w) => w.id)} onOpen={openApp} />
        <Precipitation mode={weather} />
      </motion.div>
    </WeatherContext.Provider>
  );
}
