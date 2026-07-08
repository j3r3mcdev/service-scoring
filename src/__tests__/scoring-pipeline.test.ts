import { describe, it, expect } from "@jest/globals";
import { scoringPipeline } from "../pipelines/scoring-pipeline";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

const makeEvent = (
  overrides: Partial<NormalizedEvent> = {},
): NormalizedEvent => ({
  id: "evt",
  source: "http",
  timestamp: Date.now(),
  payload: "",
  metadata: {
    ip: "127.0.0.1",
    findings: [
      {
        id: "rule-1",
        vulnerability: "sqli",
        severity: "medium",
        score: 0.7,
        evidence: [],
        chains: [],
        details: "",
      },
    ],
  },
  ...overrides,
});

describe("scoringPipeline", () => {
  it("retourne un ScoringResult avec score et chains", () => {
    const events: NormalizedEvent[] = [makeEvent(), makeEvent(), makeEvent()];

    const result = scoringPipeline(events);

    expect(result).toBeDefined();
    expect(typeof result.score).toBe("number");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.chains)).toBe(true);
  });

  it("supporte une liste vide d’événements (score cohérent)", () => {
    const events: NormalizedEvent[] = [];

    const result = scoringPipeline(events);

    expect(result).toBeDefined();
    expect(typeof result.score).toBe("number");
    expect(Array.isArray(result.chains)).toBe(true);
  });
});
