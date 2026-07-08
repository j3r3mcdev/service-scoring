import { ssrfRule } from "../../rules/ssrf.rule";
import { mockContext } from "./_helpers";
import { describe, it, expect } from "@jest/globals";

describe("rule.ssrf.basic", () => {
  it("détecte SSRF vers localhost", () => {
    const ctx = mockContext("http://127.0.0.1/admin", "http");
    const findings = ssrfRule.execute(ctx);
    expect(findings).toHaveLength(1);
  });

  it("ignore un payload normal", () => {
    const ctx = mockContext("https://google.com", "http");
    const findings = ssrfRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
