import {
  windowSize,
  countVulnInWindow,
  hasSequence,
  isDenseActivity,
  hasRepeatedVuln,
} from "../window-utils";
import { TimeWindow } from "../types";
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

describe("window-utils", () => {
  const window: TimeWindow = {
    start: 0,
    end: 60000,
    events: [evt("dns"), evt("dns"), evt("ssrf"), evt("rce")],
  };

  it("windowSize", () => {
    expect(windowSize(window)).toBe(4);
  });

  it("countVulnInWindow", () => {
    expect(countVulnInWindow(window, "dns")).toBe(2);
  });

  it("hasSequence", () => {
    expect(hasSequence(window, ["ssrf", "rce"])).toBe(true);
  });

  it("isDenseActivity", () => {
    expect(isDenseActivity(window, 3)).toBe(true);
  });

  it("hasRepeatedVuln", () => {
    expect(hasRepeatedVuln(window, "dns", 2)).toBe(true);
  });
});
