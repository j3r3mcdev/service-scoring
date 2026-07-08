import { describe, it, expect, jest } from "@jest/globals";
import { scoringWithAlerts } from "../../pipelines/scoring-pipeline";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { Alert } from "../../alerting/alert-types";
import { AlertPipeline } from "../../alerting/alert-pipeline";

const makeEvent = (): NormalizedEvent => ({
  id: "evt-1",
  source: "http",
  timestamp: Date.now(),
  payload: "",
  metadata: {
    ip: "127.0.0.1",
    findings: [
      {
        id: "rule-1",
        vulnerability: "xss",
        severity: "medium",
        score: 0.5,
        evidence: [],
        chains: [],
        details: "",
      },
    ],
  },
});

describe("scoringWithAlerts", () => {
  it("retourne un ScoringWithAlerts avec alerts", () => {
    const ip = "127.0.0.1";
    const events: NormalizedEvent[] = [makeEvent()];

    const spy = jest
      .spyOn(AlertPipeline.prototype, "run")
      .mockImplementation((ctx): Alert[] => [
        {
          id: "ml-anomaly-score",
          severity: "medium",
          message: "ML detected anomaly",
        },
      ]);

    const result = scoringWithAlerts(ip, events);

    expect(result).toBeDefined();
    expect(typeof result.score).toBe("number");
    expect(Array.isArray(result.chains)).toBe(true);
    expect(Array.isArray(result.alerts)).toBe(true);
    expect(result.alerts.length).toBeGreaterThan(0);

    // ✔ Correction TS7006 : typage explicite
    expect(result.alerts.some((a: Alert) => a.id.startsWith("ml-"))).toBe(true);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
