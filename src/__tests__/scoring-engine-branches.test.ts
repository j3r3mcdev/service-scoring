import { ScoringEngine, Finding, Severity } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

describe("ScoringEngine — branches de sévérité (lib)", () => {
  const engine = new ScoringEngine();

  function makeFinding(severity: Severity): Finding {
    return {
      id: "fake",
      vulnerability: "rce", // valeur valide du type Vulnerability
      severity,
      score: 1,
      evidence: [],
      chains: [],
      details: "",
    };
  }

  it("medium quand finding = medium", () => {
    const finding = makeFinding("medium");
    const result = engine["computeGlobalSeverity"]([finding]); // accès interne
    expect(result).toBe("medium");
  });

  it("high quand finding = high", () => {
    const finding = makeFinding("high");
    const result = engine["computeGlobalSeverity"]([finding]);
    expect(result).toBe("high");
  });

  it("critical quand finding = critical", () => {
    const finding = makeFinding("critical");
    const result = engine["computeGlobalSeverity"]([finding]);
    expect(result).toBe("critical");
  });
});
