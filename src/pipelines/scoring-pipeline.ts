import { ScoringEngine } from "../engine/scoring-engine";
import { adaptEvent } from "../adapters/event-adapter";
import { ScoringContext } from "@j3r3mcdev/scoring";
import { CorrelationEngine } from "../correlation/correlation-engine";

export function scoringPipeline(rawEvent: any) {
  const event = adaptEvent(rawEvent);

  const engine = new ScoringEngine();
  const scoring = engine.run({
    events: [event],
    chains: [],
    metadata: {},
  });

  const correlationEngine = new CorrelationEngine();
  const correlation = correlationEngine.run([event]);

  return {
    ...scoring,
    correlation,
  };
}
