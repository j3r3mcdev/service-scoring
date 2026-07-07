import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const xssRule: Rule = {
  id: "rule.xss.basic",
  name: "Détection XSS basique",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => typeof e.payload === "string");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      const payload = evt.payload ?? "";
      if (!payload) continue;

      if (/<script[^>]*>.*<\/script>/i.test(payload)) {
        findings.push({
          ruleId: "rule.xss.basic",
          vulnerability: "xss",
          severity: "medium",
          score: 40,
          details: `Payload XSS détecté: ${payload}`,
        });
      }
    }

    return findings;
  },
};
