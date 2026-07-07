import { ScoringEngine } from "../engine/scoring-engine";
import { RuleRegistry } from "../rules/rule-registry";
import { Rule, ScoringContext } from "@j3r3mcdev/scoring";

describe("ScoringEngine — branches de sévérité", () => {
  const makeContext = (score: number): ScoringContext => ({
    events: [
      {
        id: "evt",
        source: "http",
        timestamp: Date.now(),
        payload: "attack",
        metadata: {},
      },
    ],
    chains: [],
    metadata: { baseScore: score },
  });

  it("sévérité critical quand score > 80", () => {
    const rule: Rule = {
      id: "test.critical",
      name: "critical",
      applies: () => true,
      execute: () => [
        {
          ruleId: "test.critical",
          vulnerability: "sqli",
          severity: "high",
          score: 100,
          details: "boom",
        },
      ],
    };

    jest.spyOn(RuleRegistry, "getAll").mockReturnValue([rule]);

    const result = ScoringEngine.run(makeContext(100));
    expect(result.severity).toBe("critical");
  });

  it("sévérité high quand score > 40", () => {
    const rule: Rule = {
      id: "test.high",
      name: "high",
      applies: () => true,
      execute: () => [
        {
          ruleId: "test.high",
          vulnerability: "xss",
          severity: "medium",
          score: 50,
          details: "boom",
        },
      ],
    };

    jest.spyOn(RuleRegistry, "getAll").mockReturnValue([rule]);

    const result = ScoringEngine.run(makeContext(50));
    expect(result.severity).toBe("high");
  });

  it("sévérité medium quand score > 0", () => {
    const rule: Rule = {
      id: "test.medium",
      name: "medium",
      applies: () => true,
      execute: () => [
        {
          ruleId: "test.medium",
          vulnerability: "rce",
          severity: "low",
          score: 10,
          details: "boom",
        },
      ],
    };

    jest.spyOn(RuleRegistry, "getAll").mockReturnValue([rule]);

    const result = ScoringEngine.run(makeContext(10));
    expect(result.severity).toBe("medium");
  });

  it("sévérité low quand score = 0", () => {
    jest.spyOn(RuleRegistry, "getAll").mockReturnValue([]);

    const result = ScoringEngine.run(makeContext(0));
    expect(result.severity).toBe("low");
  });
});
