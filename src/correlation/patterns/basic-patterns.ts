import { NormalizedEvent } from "@j3r3mcdev/scoring";

export interface CorrelationPattern {
  id: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  score: number;
  detect: (events: NormalizedEvent[]) => boolean;
}

function has(events: NormalizedEvent[], vuln: string): boolean {
  return events.some((e) =>
    e.metadata?.findings?.some((f: any) => f.vulnerability === vuln),
  );
}

export const basicPatterns: CorrelationPattern[] = [
  {
    id: "full-intrusion-chain",
    description: "Reconnaissance → LFI → RCE",
    severity: "critical",
    score: 0.95,
    detect: (events) =>
      has(events, "path-traversal") && has(events, "lfi") && has(events, "rce"),
  },

  {
    id: "account-compromise",
    description: "Brute force → login → action sensible",
    severity: "high",
    score: 0.85,
    detect: (events) => {
      const fails = events.filter((e) =>
        e.metadata?.findings?.some((f: any) => f.vulnerability === "auth-fail"),
      ).length;

      return (
        fails > 10 && has(events, "auth-success") && has(events, "admin-action")
      );
    },
  },

  {
    id: "internal-pivot",
    description: "SSRF → DNS → RCE",
    severity: "high",
    score: 0.9,
    detect: (events) =>
      has(events, "ssrf") && has(events, "dns") && has(events, "rce"),
  },
];
