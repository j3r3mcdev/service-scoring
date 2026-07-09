import { NormalizedEvent, ScoringResult } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../../correlation-types";
import { Alert } from "../../../alerting/alert-types";

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
export interface ScoringWithAlerts extends ScoringResult {
  alerts: Alert[];
}
