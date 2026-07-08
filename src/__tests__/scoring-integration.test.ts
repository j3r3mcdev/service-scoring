import { describe, it, expect } from "@jest/globals";
import { ScoringController } from "../api/scoring.controller";
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

describe("Service-Scoring — Intégration complète", () => {
  it("détecte une attaque SQLi via le controller", () => {
    const event: NormalizedEvent = makeEvent({
      payload: "q=' OR 1=1 --",
      metadata: {},
    });

    const result = ScoringController.scoreWithAlerts("127.0.0.1", [event]);

    const sqliFinding = result.findings.find((f) => f.vulnerability === "sqli");

    expect(sqliFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });

  it("détecte une attaque XSS via le controller", () => {
    const event: NormalizedEvent = makeEvent({
      payload: "<script>alert('xss')</script>",
      metadata: {},
    });

    const result = ScoringController.scoreWithAlerts("127.0.0.1", [event]);

    const xssFinding = result.findings.find((f) => f.vulnerability === "xss");

    expect(xssFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });

  it("détecte une tentative RCE via le controller", () => {
    const event: NormalizedEvent = makeEvent({
      payload: "system('ls')",
      metadata: {},
    });

    const result = ScoringController.scoreWithAlerts("127.0.0.1", [event]);

    const rceFinding = result.findings.find((f) => f.vulnerability === "rce");

    expect(rceFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });
});
