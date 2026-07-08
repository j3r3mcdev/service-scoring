import { basicPatterns } from "../../../patterns/basic-patterns";
import { advancedPatterns } from "../../../patterns/advanced-patterns";
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

describe("basicPatterns", () => {
  it("full-intrusion-chain match", () => {
    const events = [evt("path-traversal"), evt("lfi"), evt("rce")];
    const pattern = basicPatterns.find((p) => p.id === "full-intrusion-chain");

    expect(pattern!.detect(events)).toBe(true);
  });

  it("account-compromise match", () => {
    const events = [
      ...Array.from({ length: 12 }).map(() => evt("auth-fail")),
      evt("auth-success"),
      evt("admin-action"),
    ];

    const pattern = basicPatterns.find((p) => p.id === "account-compromise");

    expect(pattern!.detect(events)).toBe(true);
  });

  it("internal-pivot match", () => {
    const events = [evt("ssrf"), evt("dns"), evt("rce")];
    const pattern = basicPatterns.find((p) => p.id === "internal-pivot");

    expect(pattern!.detect(events)).toBe(true);
  });
});

describe("advancedPatterns", () => {
  it("aucun pattern avancé ne match pour l’instant", () => {
    const events = [evt("xss")];

    for (const pattern of advancedPatterns) {
      expect(pattern.detect(events)).toBe(false);
    }
  });
});
