import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { basicPatterns } from "../../patterns/basic-patterns";
import { advancedPatterns } from "../../patterns/advanced-patterns";
import { CorrelationFinding } from "../../correlation-types";
import { EntityRegistry } from "../../multi-ip/entity-registry";
import { MultiIPCorrelationEngine } from "../../multi-ip/multi-ip-engine";
import { KillChainEngine } from "../../../killchain/kill-chain-engine";
import { GraphEngine } from "../../../event-graph/graph-engine";

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

    // KILL CHAIN (phase 5)
    const killChainEngine = new KillChainEngine();
    const killChainSteps = killChainEngine.run(findings);

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

    // MULTI‑IP (phase 4)
    const registry = new EntityRegistry();
    for (const event of events) {
      registry.add(event);
    }

    const multiIPEngine = new MultiIPCorrelationEngine();
    const multiIPFindings = multiIPEngine.run(registry);
    findings.push(...multiIPFindings);

    // ─────────────────────────────────────────────────────────────
    //  GRAPHE D'ÉVÉNEMENTS (phase 6)
    // ─────────────────────────────────────────────────────────────
    if (findings.length > 0) {
      const graphEngine = new GraphEngine();
      const graph = graphEngine.build(events, findings);

      findings.push({
        id: "event-graph",
        description: "Event graph generated",
        severity: "low",
        score: 0,
        events,
        metadata: { graph },
      });
    }

    return findings;
  }
}
