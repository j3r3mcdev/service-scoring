import { ScoringEngine } from "../engine/scoring-engine";
import { adaptEvent } from "../adapters/event-adapter";

export const scoringController = {
  score(rawEvent: unknown) {
    const event = adaptEvent(rawEvent);
    return ScoringEngine.run(event);
  },
};
