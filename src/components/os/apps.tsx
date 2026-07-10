import type { ComponentType } from "react";
import { StoryApp } from "@/components/apps/StoryApp";
import { GalleryApp } from "@/components/apps/GalleryApp";
import { MusicApp } from "@/components/apps/MusicApp";
import { LettersApp } from "@/components/apps/LettersApp";
import { MorningApp, NightApp, SmileApp, ComfortApp } from "@/components/apps/GeneratorApps";
import { FameApp } from "@/components/apps/FameApp";
import { ThingsApp } from "@/components/apps/ThingsApp";
import { PersonalityApp } from "@/components/apps/PersonalityApp";
import { YaraApp, ItalyApp, GtaApp } from "@/components/apps/PlaceApps";
import { OpenWhenApp } from "@/components/apps/OpenWhenApp";
import { SettingsApp } from "@/components/apps/SettingsApp";

export interface AppDef {
  id: string;
  title: string;
  emoji: string;
  component: ComponentType;
}

export const APPS: AppDef[] = [
  { id: "story", title: "Story", emoji: "📖", component: StoryApp },
  { id: "gallery", title: "Galerie", emoji: "📸", component: GalleryApp },
  { id: "music", title: "Musik", emoji: "🎵", component: MusicApp },
  { id: "letters", title: "Briefe", emoji: "💌", component: LettersApp },
  { id: "morning", title: "Guten Morgen", emoji: "☀️", component: MorningApp },
  { id: "night", title: "Gute Nacht", emoji: "🌙", component: NightApp },
  { id: "smile", title: "Lächeln", emoji: "😊", component: SmileApp },
  { id: "comfort", title: "Trost", emoji: "🌧️", component: ComfortApp },
  { id: "fame", title: "Hall of Fame", emoji: "⭐", component: FameApp },
  { id: "things", title: "Kleine Dinge", emoji: "🌸", component: ThingsApp },
  { id: "openwhen", title: "Öffne wenn…", emoji: "✉️", component: OpenWhenApp },
  { id: "personality", title: "Persönlichkeit", emoji: "🎨", component: PersonalityApp },
  { id: "yara", title: "Yara", emoji: "🐴", component: YaraApp },
  { id: "italy", title: "Italien", emoji: "🇮🇹", component: ItalyApp },
  { id: "gta", title: "GTA", emoji: "🎮", component: GtaApp },
  { id: "settings", title: "Einstellungen", emoji: "⚙️", component: SettingsApp },
];
