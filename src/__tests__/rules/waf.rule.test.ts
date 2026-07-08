import { wafRule } from "../../rules/waf.rule";
import { mockContext } from "./_helpers";
import { describe, it, expect } from "@jest/globals";

describe("rule.waf.basic", () => {
  it("détecte un événement WAF", () => {
    const ctx = mockContext("blocked by waf", "waf");
    const findings = wafRule.execute(ctx);
    expect(findings).toHaveLength(1);
  });

  it("ignore un payload normal", () => {
    const ctx = mockContext("hello", "waf");
    const findings = wafRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
