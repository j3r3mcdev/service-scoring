import {
  ScoringEngine,
  ScoringContext,
  NormalizedEvent,
} from "@j3r3mcdev/scoring";

describe("ScoringEngine (lib)", () => {
  it("détecte une SQLi", () => {
    const engine = new ScoringEngine();

    const event: NormalizedEvent = {
      id: "1",
      source: "http",
      timestamp: Date.now(),
      payload: "q=' OR 1=1 --",
      metadata: {},
    };

    const context: ScoringContext = {
      events: [event],
      chains: [],
      metadata: {},
    };

    const result = engine.run(context);

    const sqli = result.findings.find((f) => f.vulnerability === "sqli");

    expect(sqli).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });
});
