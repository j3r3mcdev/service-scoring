import { RuleRegistry } from "@j3r3mcdev/scoring";

describe("RuleRegistry (lib)", () => {
  it("charge toutes les règles de la lib", () => {
    const rules = RuleRegistry.getAll();
    const ids = rules.map((r) => r.id);

    expect(ids).toContain("sqli-basic");
    expect(ids).toContain("xss-basic");
    expect(ids).toContain("rce-basic");
  });
});
