import { CorrelationEngine } from "../../correlation/engine/pipeline/correlation-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

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

describe("Performance - CorrelationEngine", () => {
  const engine = new CorrelationEngine();

  it("corrèle 10 000 events en moins de 300ms", () => {
    const events = Array.from({ length: 10000 }).map((_, i) =>
      evt("dns", i * 10),
    );

    const start = performance.now();
    const result = engine.run(events);
    const end = performance.now();

    expect(result).toBeDefined();
    expect(end - start).toBeLessThan(300);
  });

  it("corrèle 100 000 events en moins de 1 seconde", () => {
    const events = Array.from({ length: 100000 }).map((_, i) =>
      evt("path-traversal", i * 5),
    );

    const start = performance.now();
    const result = engine.run(events);
    const end = performance.now();

    expect(result).toBeDefined();
    expect(end - start).toBeLessThan(1000);
  });
});
