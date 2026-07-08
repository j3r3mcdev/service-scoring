import { dnsRule } from "../../rules/dns.rule";
import { mockContext } from "./_helpers";
import { describe, it, expect } from "@jest/globals";

describe("rule.dns.basic", () => {
  it("détecte un domaine interne", () => {
    const ctx = mockContext("api.internal.local", "dns");
    const findings = dnsRule.execute(ctx);
    expect(findings).toHaveLength(1);
  });

  it("ignore un domaine normal", () => {
    const ctx = mockContext("google.com", "dns");
    const findings = dnsRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
