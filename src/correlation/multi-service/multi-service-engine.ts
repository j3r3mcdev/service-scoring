import { multiServicePatterns } from "./multi-service-patterns";
import { ServiceRegistry } from "./service-registry";

export class MultiServiceCorrelationEngine {
  run(registry: ServiceRegistry) {
    const services = registry.all();
    const findings = [];

    for (const src of services) {
      for (const dst of services) {
        if (src.service === dst.service) continue;

        for (const pattern of multiServicePatterns) {
          if (pattern.detect(src.events, dst.events)) {
            findings.push({
              id: pattern.id,
              description: pattern.description,
              severity: pattern.severity,
              score: pattern.score,
              events: [...src.events, ...dst.events],
              metadata: {
                sourceService: src.service,
                targetService: dst.service,
              },
            });
          }
        }
      }
    }

    return findings;
  }
}
