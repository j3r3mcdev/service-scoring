import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation/engine/pipeline/correlation-types";
import { Alert } from "./alert-types";

interface Profile {
  meanScore: number;
  varianceScore: number;
  eventRate: number;
  vulnDiversity: number;
  lastUpdate: number;
}

export class MLAlertEngine {
  private profiles = new Map<string, Profile>();

  updateProfile(ip: string, events: NormalizedEvent[], globalScore: number) {
    const now = Date.now();
    const profile: Profile = this.profiles.get(ip) ?? {
      meanScore: globalScore,
      varianceScore: 0,
      eventRate: events.length,
      vulnDiversity: 1,
      lastUpdate: now,
    };

    // moyenne glissante
    profile.meanScore = profile.meanScore * 0.9 + globalScore * 0.1;

    // variance glissante
    profile.varianceScore =
      profile.varianceScore * 0.9 +
      Math.abs(globalScore - profile.meanScore) * 0.1;

    // taux d’événements
    profile.eventRate = profile.eventRate * 0.8 + events.length * 0.2;

    // diversité des vulnérabilités
    const vulns = new Set(
      events.flatMap((e) =>
        (e.metadata.findings ?? []).map((f: any) => f.vulnerability),
      ),
    );
    profile.vulnDiversity = profile.vulnDiversity * 0.8 + vulns.size * 0.2;

    profile.lastUpdate = now;
    this.profiles.set(ip, profile);
  }

  generateMLAlerts(
    ip: string,
    events: NormalizedEvent[],
    correlation: CorrelationFinding[],
    globalScore: number,
  ): Alert[] {
    const alerts: Alert[] = [];
    const profile = this.profiles.get(ip);

    if (!profile) return alerts;

    const z =
      (globalScore - profile.meanScore) / (profile.varianceScore + 0.0001);

    // IDs attendus par les tests:
    // "ml-anomaly-score", "ml-anomaly-rate", "ml-anomaly-diversity"

    if (z > 3) {
      alerts.push({
        id: "ml-anomaly-score",
        severity: "high",
        message: "Anomalie détectée : score global inhabituel.",
      });
    }

    if (events.length > profile.eventRate * 2) {
      alerts.push({
        id: "ml-anomaly-rate",
        severity: "medium",
        message: "Anomalie détectée : fréquence d'événements inhabituelle.",
      });
    }

    const vulns = new Set(
      events.flatMap((e) =>
        (e.metadata.findings ?? []).map((f: any) => f.vulnerability),
      ),
    );

    if (vulns.size > profile.vulnDiversity * 2) {
      alerts.push({
        id: "ml-anomaly-diversity",
        severity: "high",
        message:
          "Anomalie détectée : diversité de vulnérabilités inhabituelle.",
      });
    }

    return alerts;
  }
}
