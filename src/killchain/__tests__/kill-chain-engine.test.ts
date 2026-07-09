import { KillChainEngine } from "../kill-chain-engine";
import { CorrelationFinding } from "../../correlation/correlation-types";
import { describe, it, expect } from "@jest/globals";

const makeFinding = (id: string): CorrelationFinding => ({
  id,
  description: id,
  severity: "high",
  score: 5,
  events: [],
  metadata: {},
});

describe("Kill Chain Engine", () => {
  it("mappe correctement les étapes", () => {
    const engine = new KillChainEngine();

    const findings = [
      makeFinding("path-traversal"),
      makeFinding("sqli"),
      makeFinding("rce"),
      makeFinding("lateral-pivot"),
      makeFinding("auth-api-escalation"),
    ];

    const steps = engine.run(findings);

    expect(steps.map((s) => s.stage)).toEqual([
      "recon",
      "delivery",
      "exploit",
      "lateral",
      "privilege",
    ]);
  });

  it("ignore les findings non mappés", () => {
    const engine = new KillChainEngine();

    const steps = engine.run([makeFinding("unknown")]);

    expect(steps.length).toBe(0);
  });
});
