import { sqliRule } from "../../rules/sqli.rule";
import { mockContext } from "./_helpers";
import { describe, it, expect } from "@jest/globals";

describe("rule.sqli.basic", () => {
  it("détecte une SQLi simple", () => {
    const ctx = mockContext("' OR 1=1 --", "http");
    const findings = sqliRule.execute(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0].vulnerability).toBe("sqli");
  });

  it("ignore un payload normal", () => {
    const ctx = mockContext("hello world", "http");
    const findings = sqliRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
