import { RuleRegistry } from "../rules/rule-registry";

describe("RuleRegistry", () => {
  it("charge toutes les règles natives", () => {
    const rules = RuleRegistry.getAll();
    expect(rules.length).toBeGreaterThan(0);
  });

  it("expose des règles valides", () => {
    const rules = RuleRegistry.getAll();
    for (const rule of rules) {
      expect(rule).toHaveProperty("id");
      expect(rule).toHaveProperty("applies");
      expect(rule).toHaveProperty("execute");
    }
  });
});
