import { Rule } from "@j3r3mcdev/scoring";
import * as rules from "./index";

export class RuleRegistry {
  private static loaded: Rule[] | null = null;

  static load(): Rule[] {
    if (this.loaded) return this.loaded;

    this.loaded = Object.values(rules).filter(
      (r): r is Rule =>
        typeof r === "object" &&
        r !== null &&
        "id" in r &&
        "applies" in r &&
        "execute" in r,
    );

    return this.loaded;
  }

  static getAll(): Rule[] {
    return this.load();
  }
}
