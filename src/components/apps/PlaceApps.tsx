import { motion } from "motion/react";
import { yaraContent, italyContent, gtaContent } from "@/data/content";
import { dailyPick } from "@/lib/daily";

export function YaraApp() {
  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">Yara 🐴</h2>
      <p className="mt-1 text-sm text-muted-foreground">Vier Hufe. Ein riesiges Herz.</p>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mt-6 overflow-hidden rounded-3xl">
        <img src={yaraContent.image} alt="Pferd auf goldener Wiese bei Sonnenuntergang" loading="lazy" width={1024} height={768} className="w-full object-cover" />
      </motion.div>
      <p className="mt-4 text-center font-hand text-2xl text-primary">„{dailyPick(yaraContent.quotes, 3)}"</p>
      <div className="mt-6 space-y-3">
        {yaraContent.cards.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-gold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ItalyApp() {
  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">Italien 🇮🇹</h2>
      <p className="mt-1 text-sm text-muted-foreground">Der Traum, der einen Platz auf der Landkarte hat.</p>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mt-6 overflow-hidden rounded-3xl">
        <img src={italyContent.image} alt="Italienischer See bei Sonnenuntergang" loading="lazy" width={1024} height={768} className="w-full object-cover" />
      </motion.div>
      <div className="mt-6 space-y-3">
        {italyContent.places.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass flex items-start gap-4 rounded-2xl p-5">
            <span className="text-2xl">{p.emoji}</span>
            <div>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{p.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl">
        <img src={italyContent.lavender} alt="Lavendelfeld in der Dämmerung" loading="lazy" width={1024} height={768} className="w-full object-cover" />
      </div>
    </div>
  );
}

export function GtaApp() {
  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-hand text-4xl text-primary">GTA World 🎮</h2>
      <p className="mt-1 text-sm text-muted-foreground">Los Santos. Chaos. Lachanfälle im Voice Chat.</p>
      <div className="mt-6 space-y-3">
        {gtaContent.markers.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 6 }}
            className="glass flex items-start gap-4 rounded-2xl p-5"
          >
            <span className="text-2xl">{m.emoji}</span>
            <div>
              <h3 className="font-semibold">{m.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{m.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
