import { scoringPipeline } from "./scoring-pipeline";
import { CorrelationEngine } from "../correlation/correlation-engine";
import { CorrelationScoring } from "../correlation/scoring/correlation-scoring";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { MultiEventResult } from "./types";
import { AlertEngine } from "../alerting/alert-engine";
import { MLAlertEngine } from "../alerting/ml-alert-engine";

const correlationEngine = new CorrelationEngine();
const correlationScoring = new CorrelationScoring();
const alertEngine = new AlertEngine();
const mlAlertEngine = new MLAlertEngine();

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

  // Scoring individuel — extraction du score numérique
  const scores = events.map((evt) => scoringPipeline(evt).score);

  // Corrélation multi‑événements
  const correlation = correlationEngine.run(events);

  // Scoring global
  const globalScore = correlationScoring.compute(events, correlation);

  // Alertes statiques
  const alerts = alertEngine.generateAlerts(events, correlation, globalScore);

  // Profil ML + alertes ML
  const ip = events[0].metadata?.ip ?? "unknown";
  mlAlertEngine.updateProfile(ip, events, globalScore);
  const mlAlerts = mlAlertEngine.generateMLAlerts(
    ip,
    events,
    correlation,
    globalScore,
  );

  return {
    events,
    scores,
    correlation,
    globalScore,
    alerts: [...alerts, ...mlAlerts],
  };
}
