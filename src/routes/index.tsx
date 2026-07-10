import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { IntroSequence } from "@/components/IntroSequence";
import { LockScreen } from "@/components/LockScreen";
import { Desktop } from "@/components/os/Desktop";

export const Route = createFileRoute("/")({
  component: Index,
});

type Phase = "intro" | "lock" | "desktop";

function Index() {
  const [phase, setPhase] = useState<Phase>("intro");

  return (
    <main className="fixed inset-0 bg-background">
      <h1 className="sr-only">Für Kathi – Ein Zuhause aus Erinnerungen</h1>
      {phase === "desktop" && <Desktop />}
      <AnimatePresence>
        {phase === "intro" && <IntroSequence key="intro" onDone={() => setPhase("lock")} />}
        {phase === "lock" && <LockScreen key="lock" onUnlock={() => setPhase("desktop")} />}
      </AnimatePresence>
    </main>
  );
}
