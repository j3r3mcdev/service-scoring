import { NormalizedEvent } from "@j3r3mcdev/scoring";

export interface EntityProfile {
  entityId: string;
  sources: Set<string>;
  protocols: Set<string>;
  payloadPatterns: Set<string>;
  eventCount: number;
}

export class ProfilingEngine {
  buildProfile(events: NormalizedEvent[]): EntityProfile {
    const sources = new Set<string>();
    const protocols = new Set<string>();
    const payloadPatterns = new Set<string>();

    for (const e of events) {
      sources.add(e.source);

      if (e.protocol) {
        protocols.add(e.protocol);
      }

      if (e.payload) {
        // UEBA fingerprint : 3 premiers caractères → regroupe les familles de payloads
        payloadPatterns.add(e.payload.slice(0, 3));
      }
    }

    return {
      entityId: "global",
      sources,
      protocols,
      payloadPatterns,
      eventCount: events.length,
    };
  }
}
