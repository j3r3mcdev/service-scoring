import { Rule, RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export const dnsRule: Rule = {
  id: "rule.dns.basic",
  name: "Détection DNS basique",

  applies(context: ScoringContext): boolean {
    return context.events.some((e) => e.source === "dns");
  },

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (evt.source !== "dns") continue;

      const payload = evt.payload ?? "";
      if (/\.internal\.local$/i.test(payload)) {
        findings.push({
          ruleId: "rule.dns.basic",
          vulnerability: "dns",
          severity: "medium",
          score: 30,
          details: `Requête DNS suspecte: ${payload}`,
        });
      }
    }

    return findings;
  },
};
