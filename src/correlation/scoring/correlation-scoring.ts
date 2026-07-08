import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../correlation-types";
import { TimeWindow } from "../windowing/types";
import { WindowEngine } from "../windowing/window-engine";
import {
  countVulnInWindow,
  isDenseActivity,
  hasRepeatedVuln,
} from "../windowing/window-utils";

export class CorrelationScoring {
  private windowEngine = new WindowEngine(60000);

  /**
   * Score global basé sur :
   * - patterns détectés
   * - nombre d'événements
   * - diversité des vulnérabilités
   * - densité d'activité
   * - répétitions
   */
  compute(events: NormalizedEvent[], findings: CorrelationFinding[]): number {
    if (events.length === 0) return 0;

    const windows = this.windowEngine.buildWindows(events);

    let score = 0;

    // 1) Score basé sur les patterns détectés
    for (const f of findings) {
      score += f.score;
    }

    // 2) Score basé sur le volume d'événements
    score += Math.min(events.length / 50, 1); // max +1

    // 3) Score basé sur la diversité des vulnérabilités
    const vulns = new Set(
      events.flatMap(
        (e) => e.metadata?.findings?.map((f: any) => f.vulnerability) ?? [],
      ),
    );
    score += Math.min(vulns.size / 10, 1); // max +1

    // 4) Score basé sur la densité d'activité dans les fenêtres
    for (const w of windows) {
      if (isDenseActivity(w, 5)) score += 0.5;
    }

    // 5) Score basé sur la répétition de vulnérabilités
    for (const vuln of vulns) {
      for (const w of windows) {
        if (hasRepeatedVuln(w, vuln, 5)) score += 0.3;
      }
    }

    // 6) Normalisation finale
    return Math.min(score, 10); // score global sur 10
  }
}
