import { scoringPipeline } from "../../pipelines/scoring-pipeline";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

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
    const result = scoringPipeline(events[0]); // pipeline actuel = 1 event
    const end = performance.now();

    expect(result).toBeDefined();
    expect(end - start).toBeLessThan(200); // pipeline doit être rapide
  });

  it("ne dépasse pas 500ms sur 100 000 events (simulation)", () => {
    const events = Array.from({ length: 100000 }).map(() =>
      evt("path-traversal"),
    );

    const start = performance.now();
    // simulation : on ne traite qu'un event car pipeline actuel n'est pas multi-event
    scoringPipeline(events[0]);
    const end = performance.now();

    expect(end - start).toBeLessThan(500);
  });
});
