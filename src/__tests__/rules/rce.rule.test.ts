import { rceRule } from "../../rules/rce.rule";
import { mockContext } from "./_helpers";

describe("rule.rce.basic", () => {
  it("détecte une commande RCE", () => {
    const ctx = mockContext("cmd=ls", "http");
    const findings = rceRule.execute(ctx);
    expect(findings).toHaveLength(1);
  });

  it("ignore un payload normal", () => {
    const ctx = mockContext("hello", "http");
    const findings = rceRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
