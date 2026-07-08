import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { basicPatterns } from "./patterns/basic-patterns";
import { advancedPatterns } from "./patterns/advanced-patterns";
import { CorrelationFinding } from "./correlation-types";

export class CorrelationEngine {
  run(events: NormalizedEvent[]): CorrelationFinding[] {
    const findings: CorrelationFinding[] = [];

    if (!events.length) return findings;

    // Basic patterns
    for (const pattern of basicPatterns) {
      if (pattern.detect(events)) {
        findings.push({
          id: pattern.id,
          description: pattern.description,
          severity: pattern.severity,
          score: pattern.score,
          events,
        });
      }
    }

    // Advanced patterns
    for (const pattern of advancedPatterns) {
      if (pattern.detect(events)) {
        findings.push({
          id: pattern.id,
          description: pattern.description,
          severity: pattern.severity,
          score: pattern.score,
          events,
        });
      }
    }

    // ❌ Aucun fallback ici
    return findings;
  }
}
