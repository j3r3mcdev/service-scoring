import {
  NormalizedEvent,
  ScoringResult,
  Vulnerability,
} from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation/engine/pipeline/correlation-types";

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

  /**
   * Features avancées pour le moteur ML.
   */
  mlFeatures?: {
    chainCount: number;
    correlationScoreTotal: number;
    correlationScoreMax: number;
    correlationScoreAvg: number;
    eventCountTotal: number;
    sourceCountTotal: number;
    vulnerabilityDistribution: Record<string, number>;
    severityHints: Array<{
      chainId: string;
      vuln: Vulnerability;
      score: number;
    }>;
  };
}
