import { ScoringEngine } from "../engine/scoring-engine";
import { adaptEvent } from "../adapters/event-adapter";

export function scoringPipeline(rawEvent: any) {
  const event = adaptEvent(rawEvent);
  const result = ScoringEngine.run(event);
}
