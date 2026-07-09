import { NormalizedEvent, ScoringResult, Severity } from "@j3r3mcdev/scoring";
import { MultiEventResult } from "./types";
import { scoringPipeline } from "./scoring-pipeline";

import { CorrelationEngine } from "./correlation-engine";
import { CorrelationScoring } from "../../scoring/correlation-scoring";
import { AlertEngine } from "../../../alerting/alert-engine";
import { MLAlertEngine } from "../../../alerting/ml-alert-engine";
import { AlertPipeline } from "../../../alerting/alert-pipeline";

const correlationEngine = new CorrelationEngine();
const correlationScoring = new CorrelationScoring();
const alertEngine = new AlertEngine();
const mlAlertEngine = new MLAlertEngine();
const alertPipeline = new AlertPipeline(alertEngine, mlAlertEngine);

export function multiEventPipeline(
  events: NormalizedEvent[],
): MultiEventResult {
  if (!Array.isArray(events) || events.length === 0) {
    return {
      events: [],
      scores: [],
      correlation: [],
      globalScore: 0,
      alerts: [],
    };
  }

  // scoringPipeline prend un tableau d'événements
  const scores = events.map((evt) => scoringPipeline([evt]).score);

  // Corrélation multi‑événements
  const correlation = correlationEngine.run(events);

  // Score global
  const globalScore = correlationScoring.compute(events, correlation);

  const ip = events[0].metadata?.ip ?? "unknown";

  // ScoringResult complet, avec Severity valide
  const scoring: ScoringResult = {
    score: globalScore,
    severity: "low" as Severity,
    findings: [],
    chains: [],
    timestamp: Date.now(),
    metadata: {},
  };

  const alerts = alertPipeline.run({
    ip,
    events,
    correlation,
    scoring,
  });

  return {
    events,
    scores,
    correlation,
    globalScore,
    alerts,
  };
}
