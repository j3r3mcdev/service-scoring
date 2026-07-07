import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const wafRule: Rule = {
  id: "rule.waf.basic",
  name: "Détection WAF generic",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => e.source === "waf");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (evt.source !== "waf") continue;

      const payload = evt.payload ?? "";
      if (/blocked|waf|security/i.test(payload)) {
        findings.push({
          ruleId: "rule.waf.basic",
          vulnerability: "waf",
          severity: "low",
          score: 10,
          details: `Événement WAF détecté: ${payload}`,
        });
      }
    }

    return findings;
  },
};
