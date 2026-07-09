import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { EntityProfile } from "./ueba-profiling";

export interface DeviationResult {
  type: string;
  score: number;
  event: NormalizedEvent;
}

export class DeviationEngine {
  detect(profile: EntityProfile, events: NormalizedEvent[]): DeviationResult[] {
    const deviations: DeviationResult[] = [];

    for (const e of events) {
      if (!profile.sources.has(e.source)) {
        deviations.push({
          type: "new-source",
          score: 2,
          event: e,
        });
      }

      if (e.protocol && !profile.protocols.has(e.protocol)) {
        deviations.push({
          type: "new-protocol",
          score: 1.5,
          event: e,
        });
      }

      if (e.payload && !profile.payloadPatterns.has(e.payload.slice(0, 10))) {
        deviations.push({
          type: "new-payload-pattern",
          score: 1,
          event: e,
        });
      }
    }

    return deviations;
  }
}
