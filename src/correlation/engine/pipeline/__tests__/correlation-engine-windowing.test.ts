import { CorrelationEngine } from "../../../../killchain/correlation-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

function evt(vuln: string, ts: number): NormalizedEvent {
  return {
    id: "evt",
    source: "http",
    timestamp: ts,
    payload: "",
    metadata: {
      ip: "1.2.3.4",
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

describe("CorrelationEngine + Windowing", () => {
  const engine = new CorrelationEngine();

  it("détecte reconnaissance lente via windowing", () => {
    const events = [
      evt("path-traversal", 1000),
      evt("path-traversal", 2000),
      evt("path-traversal", 3000),
    ];

    const result = engine.run(events);

    expect(result.find((f) => f.id === "slow-reconnaissance")).toBeDefined();
  });

  it("détecte exfiltration DNS progressive", () => {
    const events = [
      evt("dns", 1000),
      evt("dns", 1500),
      evt("dns", 2000),
      evt("dns", 2500),
      evt("dns", 3000),
    ];

    const result = engine.run(events);

    expect(
      result.find((f) => f.id === "dns-exfiltration-progressive"),
    ).toBeDefined();
  });

  it("détecte pivot avancé sur deux fenêtres", () => {
    const events = [
      evt("ssrf", 1000),
      evt("dns", 1500),
      evt("rce", 70000), // deuxième fenêtre
    ];

    const result = engine.run(events);

    expect(result.find((f) => f.id === "advanced-pivot")).toBeDefined();
  });

  it("détecte escalade de privilèges", () => {
    const events = [
      evt("auth-success", 1000),
      evt("admin-action", 1500),
      evt("config-change", 2000),
    ];

    const result = engine.run(events);

    expect(result.find((f) => f.id === "privilege-escalation")).toBeDefined();
  });
});
