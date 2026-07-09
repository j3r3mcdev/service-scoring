import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { basicPatterns } from "../correlation/patterns/basic-patterns";
import { advancedPatterns } from "../correlation/patterns/advanced-patterns";
import { CorrelationFinding } from "../correlation/correlation-types";

// PHASE 4 IMPORTS
import { EntityRegistry } from "../correlation/multi-ip/entity-registry";
import { MultiIPCorrelationEngine } from "../correlation/multi-ip/multi-ip-engine";
import { KillChainEngine } from "../killchain/kill-chain-engine";

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

    // ─────────────────────────────────────────────────────────────
    //  KILL CHAIN (phase 5)
    // ─────────────────────────────────────────────────────────────
    const killChainEngine = new KillChainEngine();
    const killChainSteps = killChainEngine.run(findings);

    // On ajoute les steps comme findings enrichis
    for (const step of killChainSteps) {
      findings.push({
        id: `killchain-${step.stage}`,
        description: `Kill Chain stage detected: ${step.stage}`,
        severity: step.finding.severity,
        score: step.finding.score,
        events: step.finding.events,
        metadata: {
          stage: step.stage,
          sourceFinding: step.finding.id,
        },
      });
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
