import { multiIPPatterns } from "./multi-ip-patterns";
import { EntityRegistry } from "./entity-registry";

export class MultiIPCorrelationEngine {
  run(registry: EntityRegistry) {
    const entities = registry.all();
    const findings = [];

    for (const src of entities) {
      for (const dst of entities) {
        if (src.ip === dst.ip) continue;

        for (const pattern of multiIPPatterns) {
          if (pattern.detect(src.events, dst.events)) {
            findings.push({
              id: pattern.id,
              description: pattern.description,
              severity: pattern.severity,
              score: pattern.score,

              // On combine les événements des deux IP
              events: [...src.events, ...dst.events],

              metadata: {
                sourceIP: src.ip,
                targetIP: dst.ip,
              },
            });
          }
        }
      }
    }

    return findings;
  }
}
