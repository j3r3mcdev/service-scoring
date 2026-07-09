import { describe, it, expect } from "@jest/globals";
import { ScoringController } from "../controller/scoring";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

const makeEvent = (
  overrides: Partial<NormalizedEvent> = {},
): NormalizedEvent => ({
  id: "evt",
  source: "http",
  timestamp: Date.now(),
  payload: "",
  metadata: {},
  ...overrides,
});

describe("ScoringController", () => {
  it("scoreWithAlerts retourne scoring + alerts", () => {
    const events: NormalizedEvent[] = [makeEvent(), makeEvent()];

    const result = ScoringController.scoreWithAlerts("127.0.0.1", events);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.alerts)).toBe(true);
  });
});
