import { CorrelationEngine } from "../../../correlation-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

function evt(vuln: string): NormalizedEvent {
  return {
    id: "evt",
    source: "http",
    timestamp: Date.now(),
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

describe("CorrelationEngine", () => {
  const engine = new CorrelationEngine();

  it("détecte reconnaissance → LFI → RCE", () => {
    const events = [evt("path-traversal"), evt("lfi"), evt("rce")];
    const result = engine.run(events);

    expect(result.find((f) => f.id === "full-intrusion-chain")).toBeDefined();
  });

  it("détecte compromission de compte", () => {
    const events = [
      ...Array.from({ length: 12 }).map(() => evt("auth-fail")),
      evt("auth-success"),
      evt("admin-action"),
    ];

    const result = engine.run(events);

    expect(result.find((f) => f.id === "account-compromise")).toBeDefined();
  });

  it("détecte pivot interne", () => {
    const events = [evt("ssrf"), evt("dns"), evt("rce")];
    const result = engine.run(events);

    expect(result.find((f) => f.id === "internal-pivot")).toBeDefined();
  });

  it("ne détecte rien si aucun pattern ne match", () => {
    const events = [evt("xss")];
    const result = engine.run(events);

    expect(result.length).toBe(0);
  });
});
