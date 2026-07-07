import {
  normalizeEvent,
  createEmptyResult,
  ScoringResult,
  Finding,
  Severity,
  NormalizedEvent,
  ScoringContext,
} from "@j3r3mcdev/scoring";
import { RuleRegistry } from "../rules/rule-registry";

export class ScoringEngine {
  static run(rawEvent: any): ScoringResult {
    const base = createEmptyResult();

    let normalized: NormalizedEvent = normalizeEvent("http", rawEvent);

    normalized = {
      ...normalized,
      payload:
        rawEvent.payload ??
        rawEvent.query ??
        rawEvent.body ??
        normalized.payload ??
        "",
      metadata: {
        ...(normalized.metadata ?? {}),
      },
    };

    const context: ScoringContext = {
      events: [normalized],
      chains: [],
      metadata: {},
    };

    const rules = RuleRegistry.getAll();
    const ruleFindings = rules
      .filter((rule) => rule.applies(context))
      .flatMap((rule) => rule.execute(context).map((rf) => ({ rule, rf })));

    const findings: Finding[] = ruleFindings.map(({ rule, rf }) => ({
      id: rf.ruleId,
      vulnerability: rf.vulnerability,
      severity: rf.severity,
      score: rf.score,
      evidence: context.events,
      chains: [],
      details: rf.details,
    }));

    const totalScore = findings.reduce((sum, f) => sum + f.score, 0);

    let globalSeverity: Severity = "low";
    if (totalScore > 80) globalSeverity = "critical";
    else if (totalScore > 40) globalSeverity = "high";
    else if (totalScore > 0) globalSeverity = "medium";

    return {
      ...base,
      findings,
      chains: [],
      score: totalScore,
      severity: globalSeverity,
      timestamp: Date.now(),
      metadata: {
        ...(base.metadata ?? {}),
        source: normalized.source,
      },
    };
  }
}
