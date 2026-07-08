import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { basicPatterns } from "./patterns/basic-patterns";
import { advancedPatterns } from "./patterns/advanced-patterns";
import { CorrelationFinding } from "./correlation-types";
import { WindowEngine } from "./windowing/window-engine";
import { TimeWindow } from "./windowing/types";

export class CorrelationEngine {
  private windowEngine = new WindowEngine(60000); // fenêtre de 1 minute

  run(events: NormalizedEvent[]): CorrelationFinding[] {
    const findings: CorrelationFinding[] = [];

    // 1) Découpage en fenêtres temporelles
    const windows: TimeWindow[] = this.windowEngine.buildWindows(events);

    // 2) Exécution des basic patterns (sur tous les events)
    for (const pattern of basicPatterns) {
      if (pattern.detect(events)) {
        findings.push({
          id: pattern.id,
          description: pattern.description,
          severity: pattern.severity,
          score: pattern.score,
          events,
        });
      }
    }

    // 3) Exécution des advanced patterns (sur les fenêtres)
    for (const pattern of advancedPatterns) {
      if (pattern.detect(events)) {
        findings.push({
          id: pattern.id,
          description: pattern.description,
          severity: pattern.severity,
          score: pattern.score,
          events,
        });
      }
    }

    return findings;
  }
}
