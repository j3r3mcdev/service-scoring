import { NormalizedEvent, Severity } from "@j3r3mcdev/scoring";

export interface MultiIPPattern {
  id: string;
  description: string;
  severity: Severity;
  score: number;
  detect(srcEvents: NormalizedEvent[], dstEvents: NormalizedEvent[]): boolean;
}

export const lateralPivotPattern: MultiIPPattern = {
  id: "lateral-pivot",
  description: "Pivot latéral entre deux IP",
  severity: "high",
  score: 5,

  detect(src, dst) {
    const hasSSRF = src.some(
      (e) => e.metadata.findings[0].vulnerability === "ssrf",
    );
    const hasRCE = dst.some(
      (e) => e.metadata.findings[0].vulnerability === "rce",
    );
    return hasSSRF && hasRCE;
  },
};

export const multiIPPatterns = [lateralPivotPattern];
