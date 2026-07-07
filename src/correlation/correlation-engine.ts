import { basicPatterns } from "./patterns/basic-patterns";
import { advancedPatterns } from "./patterns/advanced-patterns";
import { CorrelationFinding } from "./correlation-types";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

export class CorrelationEngine {
  run(events: NormalizedEvent[]): CorrelationFinding[] {
    const findings: CorrelationFinding[] = [];

    const allPatterns = [...basicPatterns, ...advancedPatterns];

    for (const pattern of allPatterns) {
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

    return findings;
  }
}
