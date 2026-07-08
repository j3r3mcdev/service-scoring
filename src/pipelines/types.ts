import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation/correlation-types";

export interface MultiEventResult {
  events: NormalizedEvent[];
  scores: any[];
  correlation: CorrelationFinding[];
  globalScore: number; // <-- AJOUT ICI
}
