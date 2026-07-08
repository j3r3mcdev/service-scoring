import { AlertEngine } from "../../alerting/alert-engine";
import { AlertContext } from "../../alerting//alert-types";
import { NormalizedEvent, ScoringResult } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

const makeEvent = (
  overrides: Partial<NormalizedEvent> = {},
): NormalizedEvent => ({
  id: "evt",
  source: "http",
  timestamp: Date.now(),
  metadata: { findings: [] },
  ...overrides,
});

const baseScoring: ScoringResult = {
  score: 0.5,
  severity: "medium",
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

describe("AlertEngine", () => {
  it("detects high global score", () => {
    const engine = new AlertEngine();
    const ctx = makeCtx({ scoring: { ...baseScoring, score: 0.9 } });

    const alerts = engine.generateAlerts(ctx);

    expect(alerts.some((a) => a.id === "high-global-score")).toBe(true);
  });

  it("detects critical pattern", () => {
    const engine = new AlertEngine();
    const ctx = makeCtx({
      correlation: [
        { id: "c1", severity: "critical", score: 1, type: "xss", events: [] },
      ] as any,
    });

    const alerts = engine.generateAlerts(ctx);

    expect(alerts.some((a) => a.id === "critical-pattern")).toBe(true);
  });

  it("detects burst activity", () => {
    const engine = new AlertEngine();
    const now = Date.now();
    const events = Array.from({ length: 10 }).map((_, i) =>
      makeEvent({ timestamp: now + i * 100 }),
    );

    const ctx = makeCtx({ events });

    const alerts = engine.generateAlerts(ctx);

    expect(alerts.some((a) => a.id === "burst-activity")).toBe(true);
  });

  it("detects multi-vector attack", () => {
    const engine = new AlertEngine();
    const events = [
      makeEvent({
        metadata: {
          findings: [
            { vulnerability: "xss" },
            { vulnerability: "sqli" },
            { vulnerability: "ssrf" },
            { vulnerability: "dns" },
          ],
        },
      } as any),
    ];

    const ctx = makeCtx({ events });

    const alerts = engine.generateAlerts(ctx);

    expect(alerts.some((a) => a.id === "multi-vector-attack")).toBe(true);
  });
});
