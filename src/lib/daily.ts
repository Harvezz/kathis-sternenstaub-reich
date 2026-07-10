/** Deterministische "tägliche" Auswahl – jeden Tag anders, nie zufällig springend. */

export function dayIndex(date = new Date()): number {
  const start = new Date(2025, 5, 1); // Juni 2025 – der Anfang
  return Math.max(0, Math.floor((date.getTime() - start.getTime()) / 86400000));
}

export function dailyPick<T>(arr: T[], salt = 0, date = new Date()): T {
  return arr[(dayIndex(date) + salt * 7919) % arr.length];
}

export function randomPick<T>(arr: T[], exclude?: T): T {
  if (arr.length === 1) return arr[0];
  let pick: T;
  do {
    pick = arr[Math.floor(Math.random() * arr.length)];
  } while (pick === exclude);
  return pick;
}

export function todayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function timeOfDay(date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

export const greetings: Record<TimeOfDay, string> = {
  morning: "Guten Morgen",
  afternoon: "Schönen Tag",
  evening: "Guten Abend",
  night: "Gute Nacht",
};

export function formatDateDE(date = new Date()): string {
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
