import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X } from "lucide-react";
import { galleryItems } from "@/data/content";

export function GalleryApp() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div>
      <h2 className="font-hand text-4xl text-primary">Polaroid-Wand</h2>
      <p className="mt-1 text-sm text-muted-foreground">Jedes Bild eine Geschichte. Diese Wand kann unendlich wachsen.</p>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {galleryItems.map((item, i) => (
          <motion.button
            key={item.caption}
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -3 : 3 }}
            whileHover={{ rotate: 0, scale: 1.05, y: -6 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="w-52 bg-[oklch(0.97_0.01_90)] p-3 pb-4 shadow-xl"
          >
            <img src={item.src} alt={item.caption} loading="lazy" width={1024} height={768} className="aspect-square w-full object-cover" />
            <p className="mt-3 font-hand text-xl text-[oklch(0.25_0.02_300)]">{item.caption}</p>
            <p className="font-hand text-sm text-[oklch(0.5_0.02_300)]">{item.date}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.05_0.02_300/85%)] p-6 backdrop-blur-xl"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-6 right-6 text-foreground/70 hover:text-foreground" aria-label="Schließen">
              <X className="h-7 w-7" />
            </button>
            <motion.figure
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="max-w-3xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryItems[active].src}
                alt={galleryItems[active].caption}
                width={1024}
                height={768}
                className="max-h-[70vh] rounded-2xl object-contain shadow-2xl"
              />
              <figcaption className="mt-4 font-hand text-3xl text-foreground">
                {galleryItems[active].caption}
                <span className="ml-3 text-lg text-muted-foreground">{galleryItems[active].date}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
