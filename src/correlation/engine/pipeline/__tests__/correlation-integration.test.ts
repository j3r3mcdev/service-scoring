import { describe, it, expect } from "@jest/globals";
import { scoringPipeline } from "../scoring-pipeline";
import { CorrelationChain } from "../correlation-types";
import { NormalizedEvent, ScoringResult } from "@j3r3mcdev/scoring";

const makeEvent = (
  overrides: Partial<NormalizedEvent> = {},
): NormalizedEvent => ({
  id: "evt",
  source: "http",
  timestamp: Date.now(),
  payload: "",
  metadata: { findings: [] },
  ...overrides,
});

describe("Correlation + Scoring — Intégration", () => {
  it("génère des chaînes de corrélation et un score", () => {
    const events: NormalizedEvent[] = [makeEvent(), makeEvent()];

    const result: ScoringResult = scoringPipeline(events);

    expect(Array.isArray(result.chains)).toBe(true);

    const anyChain = result.chains.find(
      (c: CorrelationChain) => c.events.length > 0,
    );

    expect(anyChain).toBeDefined();
  });
});
