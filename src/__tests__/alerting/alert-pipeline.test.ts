import { AlertPipeline } from "../../alerting/alert-pipeline";
import { AlertEngine } from "../../alerting/alert-engine";
import { MLAlertEngine } from "../../alerting/ml-alert-engine";
import { AlertContext } from "../../alerting/alert-types";
import { NormalizedEvent, ScoringResult } from "@j3r3mcdev/scoring";

const makeEvent = (
  overrides: Partial<NormalizedEvent> = {},
): NormalizedEvent => ({
  id: "evt",
  source: "http",
  timestamp: Date.now(),
  metadata: { findings: [] },
  ...overrides,
});
import { describe, it, expect } from "@jest/globals";

const baseScoring: ScoringResult = {
  score: 0.9,
  severity: "high",
  findings: [],
  chains: [],
  timestamp: Date.now(),
  metadata: {},
};

const makeCtx = (overrides: Partial<AlertContext> = {}): AlertContext => ({
  ip: "1.2.3.4",
  events: [makeEvent()],
  correlation: [],
  scoring: baseScoring,
  ...overrides,
});

describe("AlertPipeline", () => {
  it("combines rule alerts + ML alerts", () => {
    const pipeline = new AlertPipeline(new AlertEngine(), new MLAlertEngine());
    const ctx = makeCtx();

    pipeline.run(ctx); // init profile

    const alerts = pipeline.run(ctx);

    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts.some((a) => a.id.startsWith("ml-"))).toBe(true);
  });
});
