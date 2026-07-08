import { lfiRule } from "../../rules/lfi.rule";
import { mockContext } from "./_helpers";
import { describe, it, expect } from "@jest/globals";

describe("rule.lfi.basic", () => {
  it("détecte un path traversal", () => {
    const ctx = mockContext("../../etc/passwd", "http");
    const findings = lfiRule.execute(ctx);
    expect(findings).toHaveLength(1);
  });

  it("ignore un payload normal", () => {
    const ctx = mockContext("hello", "http");
    const findings = lfiRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
