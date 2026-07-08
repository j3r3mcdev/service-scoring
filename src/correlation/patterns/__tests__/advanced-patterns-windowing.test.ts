import { advancedPatterns } from "../advanced-patterns";
import { WindowEngine } from "../../windowing/window-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

const windowEngine = new WindowEngine(60000);

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

describe("advancedPatterns + windowing", () => {
  it("slow reconnaissance", () => {
    const events = [
      evt("path-traversal", 1000),
      evt("path-traversal", 2000),
      evt("path-traversal", 3000),
    ];

    const pattern = advancedPatterns.find(
      (p) => p.id === "slow-reconnaissance",
    );
    expect(pattern!.detect(events)).toBe(true);
  });

  it("dns exfiltration progressive", () => {
    const events = [
      evt("dns", 1000),
      evt("dns", 1500),
      evt("dns", 2000),
      evt("dns", 2500),
      evt("dns", 3000),
    ];

    const pattern = advancedPatterns.find(
      (p) => p.id === "dns-exfiltration-progressive",
    );
    expect(pattern!.detect(events)).toBe(true);
  });

  it("advanced pivot", () => {
    const events = [evt("ssrf", 1000), evt("dns", 1500), evt("rce", 70000)];

    const pattern = advancedPatterns.find((p) => p.id === "advanced-pivot");
    expect(pattern!.detect(events)).toBe(true);
  });

  it("privilege escalation", () => {
    const events = [
      evt("auth-success", 1000),
      evt("admin-action", 1500),
      evt("config-change", 2000),
    ];

    const pattern = advancedPatterns.find(
      (p) => p.id === "privilege-escalation",
    );
    expect(pattern!.detect(events)).toBe(true);
  });
});
