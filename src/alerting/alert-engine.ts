import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation/correlation-types";

export interface Alert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
}

export class AlertEngine {
  generateAlerts(
    events: NormalizedEvent[],
    correlation: CorrelationFinding[],
    globalScore: number,
  ): Alert[] {
    const alerts: Alert[] = [];

    // 1. Score global trop élevé
    if (globalScore >= 0.8) {
      alerts.push({
        id: "high-global-score",
        severity: "high",
        message: "Score global élevé — activité potentiellement malveillante.",
      });
    }

    // 2. Patterns critiques détectés
    const criticalPatterns = correlation.filter(
      (c: CorrelationFinding) => c.severity === "critical",
    );
    if (criticalPatterns.length > 0) {
      alerts.push({
        id: "critical-pattern",
        severity: "critical",
        message: "Pattern d’attaque critique détecté.",
      });
    }

    // 3. Fréquence anormale
    if (
      events.length >= 10 &&
      events[events.length - 1].timestamp - events[0].timestamp < 2000
    ) {
      alerts.push({
        id: "burst-activity",
        severity: "medium",
        message: "Activité très dense détectée.",
      });
    }

    // 4. Diversité de vulnérabilités
    const vulns = new Set(
      events.flatMap((e: NormalizedEvent) =>
        e.metadata.findings.map(
          (f: NormalizedEvent["metadata"]["findings"][number]) =>
            f.vulnerability,
        ),
      ),
    );

    if (vulns.size >= 4) {
      alerts.push({
        id: "multi-vector-attack",
        severity: "high",
        message: "Multiples vecteurs d’attaque détectés.",
      });
    }

    return alerts;
  }
}
