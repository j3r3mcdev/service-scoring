import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const pathTraversalRule: Rule = {
  id: "rule.path.basic",
  name: "Détection Path Traversal basique",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => typeof e.payload === "string");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      const payload = evt.payload ?? "";
      if (!payload) continue;

      if (/(\.\.\/)+/i.test(payload)) {
        findings.push({
          ruleId: "rule.path.basic",
          vulnerability: "path_traversal",
          severity: "medium",
          score: 35,
          details: `Payload Path Traversal détecté: ${payload}`,
        });
      }
    }

    return findings;
  },
};
