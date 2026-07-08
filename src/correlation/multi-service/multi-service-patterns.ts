import { NormalizedEvent, Severity, Finding } from "@j3r3mcdev/scoring";

export interface MultiServicePattern {
  id: string;
  description: string;
  severity: Severity;
  score: number;
  detect(serviceA: NormalizedEvent[], serviceB: NormalizedEvent[]): boolean;
}

export const httpToApiSuspiciousFlow: MultiServicePattern = {
  id: "http-api-suspicious-flow",
  description: "Transition suspecte entre HTTP et API",
  severity: "high",
  score: 4,

  detect(httpEvents, apiEvents) {
    const hasHttpAnomaly = httpEvents.some((e) =>
      e.metadata.findings?.some(
        (f: Finding) =>
          f.vulnerability === "sqli" ||
          f.vulnerability === "ssrf" ||
          f.vulnerability === "path_traversal",
      ),
    );

    const hasSensitiveApiCall = apiEvents.some((e) =>
      e.metadata.findings?.some(
        (f: Finding) => f.vulnerability === "rce" || f.vulnerability === "lfi",
      ),
    );

    return hasHttpAnomaly && hasSensitiveApiCall;
  },
};

export const multiServicePatterns = [httpToApiSuspiciousFlow];
