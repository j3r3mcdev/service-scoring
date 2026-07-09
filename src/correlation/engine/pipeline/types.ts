import { NormalizedEvent, ScoringResult } from "@j3r3mcdev/scoring";
import { CorrelationChain, CorrelationFinding } from "./correlation-types";
import { Alert } from "../../../alerting/alert-types";

/**
 * Étend le ScoringResult du package NPM pour utiliser NOTRE CorrelationChain
 * et garantit que alerts existe toujours.
 */
export interface ScoringResultExtended extends ScoringResult {
  chains: CorrelationChain[];
  alerts: Alert[]; // 🔥 plus optionnel
}

/**
 * Résultat du pipeline multi‑événements
 */
export interface MultiEventResult {
  events: NormalizedEvent[];
  scores: number[];
  correlation: CorrelationFinding[];
  globalScore: number;
  alerts: Alert[];
}

/**
 * Résultat du pipeline scoring + alerting
 */
export interface ScoringWithAlerts extends ScoringResultExtended {
  alerts: Alert[];
}
