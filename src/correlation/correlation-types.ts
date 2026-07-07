import { NormalizedEvent, Severity } from "@j3r3mcdev/scoring";

export interface CorrelationFinding {
  id: string;
  description: string;
  severity: Severity;
  score: number;
  events: NormalizedEvent[];
}
