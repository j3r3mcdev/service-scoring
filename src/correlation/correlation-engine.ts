import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { basicPatterns } from "./patterns/basic-patterns";
import { advancedPatterns } from "./patterns/advanced-patterns";
import { CorrelationFinding } from "./correlation-types";

// PHASE 4 IMPORTS
import { EntityRegistry } from "./multi-ip/entity-registry";
import { MultiIPCorrelationEngine } from "./multi-ip/multi-ip-engine";

export class CorrelationEngine {
  run(events: NormalizedEvent[]): CorrelationFinding[] {
    const findings: CorrelationFinding[] = [];

    if (!events.length) return findings;

    // BASIC PATTERNS
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

    // ADVANCED PATTERNS
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

    // MULTI‑IP CORRELATION (PHASE 4)
    const registry = new EntityRegistry();
    for (const event of events) {
      registry.add(event);
    }

    const multiIPEngine = new MultiIPCorrelationEngine();
    const multiIPFindings = multiIPEngine.run(registry);

    findings.push(...multiIPFindings);

    return findings;
  }
}
