import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const rceRule: Rule = {
  id: "rule.rce.basic",
  name: "Détection RCE basique",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => typeof e.payload === "string");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      const payload = evt.payload ?? "";
      if (!payload) continue;

      if (
        /(\bcmd=|\bexec=|\bcommand=)/i.test(payload) ||
        /\b(ls|cat|whoami)\b/.test(payload)
      ) {
        findings.push({
          ruleId: "rule.rce.basic",
          vulnerability: "rce",
          severity: "high",
          score: 60,
          details: `Payload RCE détecté: ${payload}`,
        });
      }
    }

    return findings;
  },
};
