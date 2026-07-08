import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { TimeWindow } from "./types";
import { hasVuln } from "../utils/event-utils";

/**
 * Retourne le nombre d'événements dans une fenêtre.
 */
export function windowSize(window: TimeWindow): number {
  return window.events.length;
}

/**
 * Retourne le nombre d'événements correspondant à une vulnérabilité donnée.
 */
export function countVulnInWindow(window: TimeWindow, vuln: string): number {
  return window.events.filter((e) => hasVuln(e, vuln)).length;
}

/**
 * Vérifie si une séquence vuln A → vuln B → vuln C apparaît dans la fenêtre.
 */
export function hasSequence(window: TimeWindow, sequence: string[]): boolean {
  const vulns = window.events.flatMap(
    (e) => e.metadata?.findings?.map((f: any) => f.vulnerability) ?? [],
  );

  let index = 0;
  for (const vuln of vulns) {
    if (vuln === sequence[index]) {
      index++;
      if (index === sequence.length) return true;
    }
  }
  return false;
}

/**
 * Détecte une activité "dense" (ex : reconnaissance lente).
 * Exemple : ≥ 3 events dans une fenêtre de ≥ 1 minute.
 */
export function isDenseActivity(
  window: TimeWindow,
  minEvents: number,
): boolean {
  return window.events.length >= minEvents;
}

/**
 * Détecte une répétition d'une vulnérabilité (ex : brute force lent).
 */
export function hasRepeatedVuln(
  window: TimeWindow,
  vuln: string,
  minCount: number,
): boolean {
  return countVulnInWindow(window, vuln) >= minCount;
}
