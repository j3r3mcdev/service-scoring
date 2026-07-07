import { BaseRule } from "@j3r3mcdev/scoring/dist/rules/base-rule";
import { RuleFinding, ScoringContext } from "@j3r3mcdev/scoring";

export class ExampleCustomRule extends BaseRule {
  id = "custom.example";
  name = "Example Custom Rule";

  applies(ctx: ScoringContext): boolean {
    return false;
  }

  execute(ctx: ScoringContext): RuleFinding[] {
    return [];
  }
}
