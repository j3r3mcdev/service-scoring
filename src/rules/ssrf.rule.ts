import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const ssrfRule: Rule = {
  id: "rule.ssrf.basic",
  name: "Détection SSRF basique",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => typeof e.payload === "string");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      const payload = evt.payload ?? "";
      if (!payload) continue;

      if (
        /https?:\/\/(127\.0\.0\.1|localhost|169\.254\.169\.254)/i.test(payload)
      ) {
        findings.push({
          ruleId: "rule.ssrf.basic",
          vulnerability: "ssrf",
          severity: "high",
          score: 55,
          details: `Payload SSRF détecté: ${payload}`,
        });
      }
    }

    return findings;
  },
};
