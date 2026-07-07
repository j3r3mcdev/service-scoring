import { ScoringEngine } from "../engine/scoring-engine";
import { adaptEvent } from "../adapters/event-adapter";
import { ScoringContext } from "@j3r3mcdev/scoring";

export function scoringPipeline(rawEvent: any) {
  const event = adaptEvent(rawEvent);

  const context: ScoringContext = {
    events: [event],
    chains: [],
    metadata: event.metadata ?? {},
  };

  const engine = new ScoringEngine();
  return engine.run(context);
}
