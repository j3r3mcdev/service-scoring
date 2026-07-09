import {
  NormalizedEvent,
  ScoringResult,
  CorrelationChain,
  Severity,
} from "@j3r3mcdev/scoring";

import { AlertPipeline } from "../../../alerting/alert-pipeline";
import { AlertEngine } from "../../../alerting/alert-engine";
import { MLAlertEngine } from "../../../alerting/ml-alert-engine";

import { scoringPipeline } from "./scoring-pipeline";
import { CorrelationFinding } from "../../correlation-types";
import { ScoringWithAlerts } from "./types";

/**
 * Convertit CorrelationChain → CorrelationFinding pour l’alerting
 */
function convertChainsToFindings(
  chains: CorrelationChain[],
): CorrelationFinding[] {
  return chains.map((c) => ({
    id: c.id,
    description: `Correlation chain ${c.id}`,
    severity: "medium" as Severity,
    score: c.confidence,
    events: c.events,
  }));
}

const alertPipeline = new AlertPipeline(new AlertEngine(), new MLAlertEngine());

export function scoringWithAlerts(
  ip: string,
  events: NormalizedEvent[],
): ScoringWithAlerts {
  const scoring = scoringPipeline(events);

  const correlationFindings = convertChainsToFindings(scoring.chains);

  const alerts = alertPipeline.run({
    ip,
    events,
    correlation: correlationFindings,
    scoring,
  });

  return {
    ...scoring,
    alerts,
  };
}
