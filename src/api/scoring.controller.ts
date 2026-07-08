import { scoringWithAlerts } from "../pipelines/scoring-pipeline";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

export const ScoringController = {
  scoreWithAlerts(ip: string, events: NormalizedEvent[]) {
    return scoringWithAlerts(ip, events);
  },
};
