import { ScoringEngine } from "../engine/scoring-engine";
import { adaptEvent } from "../adapters/event-adapter";

export const scoringController = {
  score(event: unknown) {
    const adapted = adaptEvent(event);
    return ScoringEngine.run(adapted);
  },
};
