import { scoringPipeline } from "../../pipelines/scoring-pipeline";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

function evt(vuln: string): NormalizedEvent {
  return {
    id: "evt",
    source: "http",
    timestamp: Date.now(),
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

describe("Performance - Pipeline", () => {
  it("peut traiter 10 000 events sans crash", () => {
    const events = Array.from({ length: 10000 }).map(() => evt("dns"));

    const start = performance.now();
    const result = scoringPipeline(events); // pipeline multi‑events
    const end = performance.now();

    expect(result).toBeDefined();
    expect(end - start).toBeLessThan(200);
  });

  it("ne dépasse pas 500ms sur 100 000 events (simulation)", () => {
    const events = Array.from({ length: 100000 }).map(() =>
      evt("path-traversal"),
    );

    const start = performance.now();
    scoringPipeline(events);
    const end = performance.now();

    expect(end - start).toBeLessThan(500);
  });
});
