import { CorrelationChain, Vulnerability } from "@j3r3mcdev/scoring";

function baseVulnWeight(vuln: Vulnerability): number {
  switch (vuln) {
    case "rce":
    case "ssrf":
      return 0.9;
    case "sqli":
    case "lfi":
    case "path_traversal":
      return 0.7;
    case "xss":
      return 0.5;
    default:
      return 0.3;
  }
}

export function computeAttackLikelihood(chain: CorrelationChain): number {
  const events = chain.events ?? [];
  const eventCount = chain.eventCount ?? events.length;
  const sourceCount =
    chain.sourceCount ?? new Set(events.map((e) => e.source)).size;

  const timestamps = events
    .map((e) => e.timestamp)
    .filter((t) => typeof t === "number")
    .sort((a, b) => a - b);

  const deltaMs =
    timestamps.length > 1
      ? timestamps[timestamps.length - 1] - timestamps[0]
      : 0;

  const vulnWeight = baseVulnWeight(chain.type);

  const eventFactor = Math.min(eventCount / 10, 1); // saturé à 10 events
  const sourceFactor = Math.min(sourceCount / 3, 1); // saturé à 3 sources
  const timeFactor = deltaMs <= 0 ? 0.2 : Math.min(600_000 / deltaMs, 1); // 10 min fenêtre

  let likelihood = 0;

  likelihood += 0.4 * vulnWeight;
  likelihood += 0.2 * eventFactor;
  likelihood += 0.2 * sourceFactor;
  likelihood += 0.2 * timeFactor;

  if (Number.isNaN(likelihood)) return 0;

  return Math.min(Math.max(likelihood, 0), 1);
}
