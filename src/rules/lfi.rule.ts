import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const lfiRule: Rule = {
  id: "rule.lfi.basic",
  name: "Détection LFI basique",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => typeof e.payload === "string");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      const payload = evt.payload ?? "";
      if (!payload) continue;

      if (/(\.\.\/)+/i.test(payload) || /etc\/passwd/i.test(payload)) {
        findings.push({
          ruleId: "rule.lfi.basic",
          vulnerability: "lfi",
          severity: "high",
          score: 50,
          details: `Payload LFI détecté: ${payload}`,
        });
      }
    }

    return findings;
  },
};
