import { Alert, AlertContext } from "./alert-types";

export class AlertEngine {
  generateAlerts(ctx: AlertContext): Alert[] {
    const alerts: Alert[] = [];
    const { events, correlation, scoring } = ctx;

    // 1. Score global élevé
    if (scoring.score >= 0.8) {
      alerts.push({
        id: "high-global-score",
        severity: "high",
        message: "Score global élevé — activité potentiellement malveillante.",
      });
    }

    // 2. Patterns critiques
    const critical = correlation.filter((c) => c.severity === "critical");
    if (critical.length > 0) {
      alerts.push({
        id: "critical-pattern",
        severity: "critical",
        message: "Pattern d’attaque critique détecté.",
      });
    }

    // 3. Burst d’activité
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
      events.flatMap((e) =>
        (e.metadata.findings ?? []).map((f: any) => f.vulnerability),
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
