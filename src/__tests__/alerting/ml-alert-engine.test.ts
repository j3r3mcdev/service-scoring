import { MLAlertEngine } from "../../alerting/ml-alert-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
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

describe("MLAlertEngine", () => {
  it("no alerts without profile", () => {
    const engine = new MLAlertEngine();
    const alerts = engine.generateMLAlerts("ip", [], [], 0.9);
    expect(alerts).toHaveLength(0);
  });

  it("detects anomaly score", () => {
    const engine = new MLAlertEngine();
    const events = [makeEvent()];
    engine.updateProfile("ip", events, 0.2);

    const alerts = engine.generateMLAlerts("ip", events, [], 0.9);

    expect(alerts.some((a) => a.id === "ml-anomaly-score")).toBe(true);
  });

  it("detects anomaly rate", () => {
    const engine = new MLAlertEngine();
    const events = [makeEvent()];
    engine.updateProfile("ip", events, 0.5);

    const manyEvents = Array.from({ length: 50 }).map(() => makeEvent());
    const alerts = engine.generateMLAlerts("ip", manyEvents, [], 0.5);

    expect(alerts.some((a) => a.id === "ml-anomaly-rate")).toBe(true);
  });

  it("detects anomaly diversity", () => {
    const engine = new MLAlertEngine();
    const baseEvents = [
      makeEvent({
        metadata: { findings: [{ vulnerability: "xss" }] },
      } as any),
    ];
    engine.updateProfile("ip", baseEvents, 0.5);

    const diverseEvents = [
      makeEvent({
        metadata: {
          findings: [
            { vulnerability: "xss" },
            { vulnerability: "sqli" },
            { vulnerability: "ssrf" },
            { vulnerability: "dns" },
            { vulnerability: "rce" },
          ],
        },
      } as any),
    ];

    const alerts = engine.generateMLAlerts("ip", diverseEvents, [], 0.5);

    expect(alerts.some((a) => a.id === "ml-anomaly-diversity")).toBe(true);
  });
});
