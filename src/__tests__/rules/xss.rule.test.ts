import { xssRule } from "../../rules/xss.rule";
import { mockContext } from "./_helpers";
import { describe, it, expect } from "@jest/globals";

describe("rule.xss.basic", () => {
  it("détecte un script XSS", () => {
    const ctx = mockContext("<script>alert(1)</script>", "http");
    const findings = xssRule.execute(ctx);
    expect(findings).toHaveLength(1);
  });

  it("ignore un payload sain", () => {
    const ctx = mockContext("api.internal.local", "http");
    const findings = xssRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
