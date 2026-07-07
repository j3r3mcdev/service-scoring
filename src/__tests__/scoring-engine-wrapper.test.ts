import * as wrapper from "../engine/scoring-engine";
import { ScoringEngine } from "@j3r3mcdev/scoring";

describe("scoring-engine wrapper", () => {
  it("réexporte le moteur de la lib", () => {
    expect(wrapper.ScoringEngine).toBe(ScoringEngine);
  });
});
