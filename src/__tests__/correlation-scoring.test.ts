import { CorrelationScoring } from "../correlation/scoring/correlation-scoring";
import { CorrelationEngine } from "../correlation/correlation-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

function evt(vuln: string, ts: number): NormalizedEvent {
  return {
    id: "evt",
    source: "http",
    timestamp: ts,
    payload: "",
    metadata: {
      ip: "127.0.0.1",
      findings: [
        {
          id: "rule",
          vulnerability: vuln,
          severity: "medium",
          score: 0.5,
          evidence: [],
          chains: [],
          details: "",
        },
      ],
    },
  };
}

describe("CorrelationScoring", () => {
  const engine = new CorrelationEngine();
  const scoring = new CorrelationScoring();

  it("produit un score global cohérent", () => {
    const events = [evt("ssrf", 1000), evt("dns", 1500), evt("rce", 70000)];

    const findings = engine.run(events);
    const score = scoring.compute(events, findings);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(10);
  });

  it("score plus élevé avec plus d'événements", () => {
    const few = [evt("dns", 1000)];
    const many = Array.from({ length: 50 }).map((_, i) => evt("dns", i * 1000));

    const fFew = engine.run(few);
    const fMany = engine.run(many);

    const sFew = scoring.compute(few, fFew);
    const sMany = scoring.compute(many, fMany);

    expect(sMany).toBeGreaterThan(sFew);
  });
});
