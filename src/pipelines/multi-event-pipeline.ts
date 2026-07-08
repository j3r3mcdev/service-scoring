import { scoringPipeline } from "./scoring-pipeline";
import { CorrelationEngine } from "../correlation/correlation-engine";
import { CorrelationScoring } from "../correlation/scoring/correlation-scoring";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { MultiEventResult } from "./types";

const correlationEngine = new CorrelationEngine();
const correlationScoring = new CorrelationScoring();

export function multiEventPipeline(
  events: NormalizedEvent[],
): MultiEventResult {
  if (!Array.isArray(events) || events.length === 0) {
    return {
      events: [],
      scores: [],
      correlation: [],
      globalScore: 0, // <-- maintenant accepté
    };
  }

  const scores = events.map((evt) => scoringPipeline(evt));
  const correlation = correlationEngine.run(events);
  const globalScore = correlationScoring.compute(events, correlation);

  return {
    events,
    scores,
    correlation,
    globalScore, // <-- maintenant accepté
  };
}
