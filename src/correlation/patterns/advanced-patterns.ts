import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationPattern } from "./basic-patterns";
import { WindowEngine } from "../windowing/window-engine";
import {
  countVulnInWindow,
  hasSequence,
  isDenseActivity,
} from "../windowing/window-utils";

const windowEngine = new WindowEngine(60000); // fenêtre de 1 minute

export const advancedPatterns: CorrelationPattern[] = [
  {
    id: "slow-reconnaissance",
    description: "Reconnaissance lente sur plusieurs minutes",
    severity: "medium",
    score: 0.6,
    detect: (events) => {
      const windows = windowEngine.buildWindows(events);
      return windows.some((w) => isDenseActivity(w, 3));
    },
  },

  {
    id: "dns-exfiltration-progressive",
    description: "Exfiltration DNS progressive",
    severity: "high",
    score: 0.8,
    detect: (events) => {
      const windows = windowEngine.buildWindows(events);
      return windows.some((w) => countVulnInWindow(w, "dns") >= 5);
    },
  },

  {
    id: "advanced-pivot",
    description: "Pivot interne avancé : SSRF → DNS → RCE dans deux fenêtres",
    severity: "critical",
    score: 0.95,
    detect: (events) => {
      const windows = windowEngine.buildWindows(events);
      if (windows.length < 2) return false;

      const first = windows[0];
      const second = windows[1];

      const seq1 = hasSequence(first, ["ssrf", "dns"]);
      const seq2 = hasSequence(second, ["rce"]);

      return seq1 && seq2;
    },
  },

  {
    id: "privilege-escalation",
    description:
      "Escalade de privilèges : auth-success → admin-action → config-change",
    severity: "critical",
    score: 0.9,
    detect: (events) => {
      const windows = windowEngine.buildWindows(events);
      return windows.some((w) =>
        hasSequence(w, ["auth-success", "admin-action", "config-change"]),
      );
    },
  },
];
