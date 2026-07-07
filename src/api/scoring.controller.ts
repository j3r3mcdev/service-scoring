import { ScoringEngine } from "@j3r3mcdev/scoring";
import { adaptEvent } from "../adapters/event-adapter";
import { ScoringContext } from "@j3r3mcdev/scoring";

export const scoringController = {
  score(rawEvent: unknown) {
    const event = adaptEvent(rawEvent);

    const context: ScoringContext = {
      events: [event],
      chains: [],
      metadata: event.metadata ?? {},
    };

    const engine = new ScoringEngine();
    return engine.run(context);
  },
};
