import { NormalizedEvent, Vulnerability, Severity } from "@j3r3mcdev/scoring";

/**
 * Chaîne de corrélation enrichie (version XDR)
 */
export interface CorrelationChain {
  id: string;
  type: Vulnerability;
  events: NormalizedEvent[];
  confidence: number;

  correlationScore?: number;
  eventCount?: number;
  sourceCount?: number;
  attackLikelihood?: number;
}

/**
 * Résultat brut d’un détecteur de corrélation (patterns, killchain, multi‑IP, UEBA…)
 */
export interface CorrelationFinding {
  id: string;
  description: string;
  severity: Severity;
  score: number;
  events: NormalizedEvent[];
  metadata?: Record<string, any>;
}
