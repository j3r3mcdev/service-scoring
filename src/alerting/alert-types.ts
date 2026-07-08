import { NormalizedEvent, ScoringResult } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation/correlation-types";

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
}

export interface AlertContext {
  ip: string;
  events: NormalizedEvent[];
  correlation: CorrelationFinding[];
  scoring: ScoringResult;
}
