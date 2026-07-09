import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation/engine/pipeline/correlation-types";
import { ProfilingEngine } from "./ueba-profiling";
import { DeviationEngine } from "./ueba-deviation";

export class UEBAEngine {
  run(events: NormalizedEvent[]): CorrelationFinding[] {
    if (events.length < 2) return [];

    // Profil historique = tous les événements sauf le dernier
    const profiling = new ProfilingEngine();
    const profile = profiling.buildProfile(events.slice(0, -1));

    // Détection = dernier événement uniquement
    const deviationEngine = new DeviationEngine();
    const deviations = deviationEngine.detect(profile, [
      events[events.length - 1],
    ]);

    return deviations.map((d) => ({
      id: `ueba-${d.type}`,
      description: `UEBA anomaly detected: ${d.type}`,
      severity: "medium",
      score: d.score,
      events: [d.event],
      metadata: {
        anomalyType: d.type,
        profile,
      },
    }));
  }
}
