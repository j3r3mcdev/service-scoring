import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationPattern } from "./basic-patterns";

function has(events: NormalizedEvent[], vuln: string): boolean {
  return events.some((e) =>
    e.metadata?.findings?.some((f: any) => f.vulnerability === vuln),
  );
}

export const advancedPatterns: CorrelationPattern[] = [
  {
    id: "slow-reconnaissance",
    description: "Reconnaissance lente sur plusieurs minutes",
    severity: "medium",
    score: 0.6,
    detect: (_events) => false, // TODO: implémenter windowing
  },

  {
    id: "dns-exfiltration-progressive",
    description: "Exfiltration DNS progressive",
    severity: "high",
    score: 0.8,
    detect: (_events) => false, // TODO: implémenter séquences DNS
  },

  {
    id: "advanced-pivot",
    description: "Pivot interne avancé",
    severity: "critical",
    score: 0.95,
    detect: (_events) => false, // TODO: implémenter pivot multi‑événements
  },

  {
    id: "privilege-escalation",
    description: "Escalade de privilèges",
    severity: "critical",
    score: 0.9,
    detect: (_events) => false, // TODO: implémenter séquences auth
  },
];
