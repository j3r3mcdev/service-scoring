import { NormalizedEvent } from "@j3r3mcdev/scoring";

export interface TimeWindow {
  start: number;
  end: number;
  events: NormalizedEvent[];
}

export interface WindowFinding {
  id: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  score: number;
  window: TimeWindow;
}

export interface WindowAnalysis {
  windows: TimeWindow[];
  findings: WindowFinding[];
}
