import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation/correlation-types";
import { Alert } from "../alerting/alert-engine";

export interface MultiEventResult {
  events: NormalizedEvent[];
  scores: number[];
  correlation: CorrelationFinding[];
  globalScore: number;
  alerts: Alert[];
}
