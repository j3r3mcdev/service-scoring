import {
  normalizeEvent,
  createEmptyResult,
  ScoringResult,
  Finding,
  Severity,
  NormalizedEvent,
} from "@j3r3mcdev/scoring";

export class ScoringEngine {
  static run(rawEvent: any): ScoringResult {
    const base = createEmptyResult();

    // 1. Normalisation HTTP
    let normalized: NormalizedEvent = normalizeEvent("http", rawEvent);

    // 2. FIX : injecter le payload manquant
    normalized = {
      ...normalized,
      payload:
        rawEvent.payload ??
        rawEvent.query ??
        rawEvent.body ??
        normalized.payload ??
        "",
    };

    const payload: string = normalized.payload ?? "";

    const findings: Finding[] = [];

    const sevLow: Severity = "low";
    const sevMedium: Severity = "medium";
    const sevHigh: Severity = "high";

    // SQLi
    if (/('|")\s*or\s*1=1/i.test(payload) || /(--|#)/.test(payload)) {
      findings.push({
        id: "sqli-basic",
        vulnerability: "sqli",
        severity: sevHigh,
        score: 50,
        evidence: [normalized],
        details: `SQLi détectée dans le payload: ${payload}`,
      });
    }

    // XSS
    if (/<script[^>]*>.*<\/script>/i.test(payload)) {
      findings.push({
        id: "xss-basic",
        vulnerability: "xss",
        severity: sevMedium,
        score: 40,
        evidence: [normalized],
        details: `XSS détectée dans le payload: ${payload}`,
      });
    }

    // RCE
    if (
      /(\bcmd=|\bexec=|\bcommand=)/i.test(payload) ||
      /\b(ls|cat|whoami)\b/.test(payload)
    ) {
      findings.push({
        id: "rce-basic",
        vulnerability: "rce",
        severity: sevHigh,
        score: 60,
        evidence: [normalized],
        details: `RCE détectée dans le payload: ${payload}`,
      });
    }

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
        source: normalized.source,
      },
    };
  }
}
