import { multiEventPipeline } from "../pipelines/multi-event-pipeline";
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

describe("multiEventPipeline", () => {
  it("traite plusieurs événements et renvoie un résultat global", () => {
    const events = [
      evt("dns", 1000),
      evt("path-traversal", 2000),
      evt("rce", 3000),
    ];

    const result = multiEventPipeline(events, { useHistory: false });

    expect(result.events.length).toBe(3);
    expect(result.scores.length).toBe(3);
    expect(result.correlation).toBeDefined();
  });

  it("détecte un pattern avancé via multi‑événements", () => {
    const events = [evt("ssrf", 1000), evt("dns", 1500), evt("rce", 70000)];

    const result = multiEventPipeline(events);

    const pivot = result.correlation.find((f) => f.id === "advanced-pivot");
    expect(pivot).toBeDefined();
  });
});
