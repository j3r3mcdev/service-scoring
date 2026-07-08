import { pathTraversalRule } from "../../rules/path.rule";
import { mockContext } from "./_helpers";
import { describe, it, expect } from "@jest/globals";

describe("rule.path.basic", () => {
  it("détecte ../", () => {
    const ctx = mockContext("../secret", "http");
    const findings = pathTraversalRule.execute(ctx);
    expect(findings).toHaveLength(1);
  });

  it("ignore un payload normal", () => {
    const ctx = mockContext("hello", "http");
    const findings = pathTraversalRule.execute(ctx);
    expect(findings).toHaveLength(0);
  });
});
