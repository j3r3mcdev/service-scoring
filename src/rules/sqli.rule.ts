import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const sqliRule: Rule = {
  id: "rule.sqli.basic",
  name: "Détection SQLi basique",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => typeof e.payload === "string");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      const payload = evt.payload ?? "";
      if (!payload) continue;

      if (/('|")\s*or\s*1=1/i.test(payload) || /(--|#)/.test(payload)) {
        findings.push({
          ruleId: "rule.sqli.basic",
          vulnerability: "sqli",
          severity: "high",
          score: 50,
          details: `Payload suspect: ${payload}`,
        });
      }
    }

    return findings;
  },
};
