import { scoringPipeline } from "./scoring-pipeline";
import { CorrelationEngine } from "../correlation/correlation-engine";
import { CorrelationScoring } from "../correlation/scoring/correlation-scoring";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { MultiEventResult } from "./types";
import { EventHistoryStore } from "../storage/event-history";

const history = new EventHistoryStore();
const correlationEngine = new CorrelationEngine();
const correlationScoring = new CorrelationScoring();

export function multiEventPipeline(
  events: NormalizedEvent[],
  options: { useHistory?: boolean } = { useHistory: true },
): MultiEventResult {
  if (!Array.isArray(events) || events.length === 0) {
    return {
      events: [],
      scores: [],
      correlation: [],
      globalScore: 0,
    };
  }

  let allEvents = events;

  // Historique activé uniquement si demandé
  if (options.useHistory) {
    events.forEach((evt) => history.add(evt));

    const ip = events[0].metadata?.ip ?? "";
    const historicalEvents = history.get(ip);

    allEvents = [...historicalEvents, ...events];
  }

  const scores = allEvents.map((evt) => scoringPipeline(evt));
  const correlation = correlationEngine.run(allEvents);
  const globalScore = correlationScoring.compute(allEvents, correlation);

  return {
    events: allEvents,
    scores,
    correlation,
    globalScore,
  };
}
