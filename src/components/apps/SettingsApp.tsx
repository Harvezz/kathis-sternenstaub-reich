import { CloudRain, Snowflake, Sparkles } from "lucide-react";
import { useWeather } from "@/components/os/WeatherContext";
import type { WeatherMode } from "@/components/effects/Precipitation";

const options: { mode: WeatherMode; label: string; icon: typeof Sparkles }[] = [
  { mode: "clear", label: "Klarer Himmel", icon: Sparkles },
  { mode: "rain", label: "Regen", icon: CloudRain },
  { mode: "snow", label: "Schnee", icon: Snowflake },
];

export function SettingsApp() {
  const { weather, setWeather } = useWeather();

  return (
    <div className="mx-auto max-w-md">
      <h2 className="font-hand text-4xl text-primary">Einstellungen</h2>
      <p className="mt-1 text-sm text-muted-foreground">Mach dir diesen Ort so gemütlich, wie du willst.</p>

      <h3 className="mt-8 text-sm font-semibold tracking-widest text-muted-foreground uppercase">Wetter-Stimmung</h3>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {options.map((o) => (
          <button
            key={o.mode}
            onClick={() => setWeather(o.mode)}
            className={`glass flex flex-col items-center gap-2 rounded-2xl p-4 text-sm transition-all hover:scale-[1.03] ${weather === o.mode ? "ring-1 ring-primary" : ""}`}
          >
            <o.icon className="h-6 w-6 text-primary" />
            {o.label}
          </button>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground/60">
        Kathi OS · Version 1.0 · Handgemacht mit 💜
      </p>
    </div>
  );
}
