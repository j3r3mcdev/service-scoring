import { NormalizedEvent, Vulnerability } from "@j3r3mcdev/scoring";

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
