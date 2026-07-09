import {
  NormalizedEvent,
  ScoringResult,
  ScoringContext,
  Severity,
  Vulnerability,
} from "@j3r3mcdev/scoring";

import { CorrelationChain, CorrelationFinding } from "./correlation-types";

import { AlertPipeline } from "../../../alerting/alert-pipeline";
import { AlertEngine } from "../../../alerting/alert-engine";
import { MLAlertEngine } from "../../../alerting/ml-alert-engine";
import { ScoringWithAlerts } from "./types";

import { ScoringEngine } from "../../../engine/scoring-engine";
import { CorrelationEngine } from "./correlation-engine";

import { computeAttackLikelihood } from "./probabilistic-correlation";

/**
 * Bonus de sévérité pour le score de corrélation avancé.
 */
function severityBonus(vuln: Vulnerability): number {
  switch (vuln) {
    case "rce":
    case "ssrf":
    case "sqli":
      return 2;
    case "xss":
    case "lfi":
    case "path_traversal":
      return 1;
    default:
      return 0;
  }
}

/**
 * Score de corrélation avancé.
 */
function computeCorrelationScore(chain: CorrelationChain): number {
  const eventCount = chain.events.length;
  const sources = new Set(chain.events.map((e) => e.source));
  const sourceCount = sources.size;

  let score = chain.confidence;

  score += eventCount * 0.5;
  score += sourceCount * 1.0;
  score += severityBonus(chain.type);

  return score;
}

/**
 * Convertit CorrelationChain → CorrelationFinding pour l’alerting.
 */
function convertChainsToFindings(
  chains: Array<CorrelationChain | CorrelationFinding>,
): CorrelationFinding[] {
  return chains.map((c) => {
    if ("score" in c && "severity" in c) {
      return c;
    }

    return {
      id: c.id,
      description: `Correlation chain ${c.id}`,
      severity: "medium" as Severity,
      score: c.confidence,
      events: c.events,
    };
  });
}

export function scoringPipeline(events: NormalizedEvent[]): ScoringResult {
  const correlationEngine = new CorrelationEngine();
  const rawFindings: CorrelationFinding[] = correlationEngine.run(events);

  let chains: CorrelationChain[] = rawFindings.map((f) => {
    const vuln: Vulnerability =
      f.events[0]?.metadata?.findings?.[0]?.vulnerability ?? "http";

    const evts = f.events;
    const sources = new Set(evts.map((e) => e.source));

    const baseChain: CorrelationChain = {
      id: f.id,
      type: vuln,
      confidence: f.score,
      events: evts,
      eventCount: evts.length,
      sourceCount: sources.size,
    };

    const correlationScore = computeCorrelationScore(baseChain);
    const attackLikelihood = computeAttackLikelihood(baseChain);

    return {
      ...baseChain,
      correlationScore,
      attackLikelihood,
    };
  });

  if (chains.length === 0) {
    const sources = new Set(events.map((e) => e.source));

    const fallback: CorrelationChain = {
      id: "auto-correlation",
      type: "http",
      confidence: 0.1,
      events,
      eventCount: events.length,
      sourceCount: sources.size,
    };

    fallback.correlationScore = computeCorrelationScore(fallback);
    fallback.attackLikelihood = computeAttackLikelihood(fallback);

    chains = [fallback];
  }

  const context: ScoringContext = {
    events,
    chains,
    metadata: {},
  };

  const scoringEngine = new ScoringEngine();
  return scoringEngine.run(context);
}

const alertPipeline = new AlertPipeline(new AlertEngine(), new MLAlertEngine());

export function scoringWithAlerts(
  ip: string,
  events: NormalizedEvent[],
): ScoringWithAlerts {
  const scoring = scoringPipeline(events);
  const correlationFindings = convertChainsToFindings(scoring.chains);

  const chainCount = scoring.chains.length;

  const correlationScoreTotal = scoring.chains.reduce(
    (acc, c) => acc + (c.correlationScore ?? 0),
    0,
  );

  const correlationScoreMax = Math.max(
    ...scoring.chains.map((c) => c.correlationScore ?? 0),
  );

  const correlationScoreAvg =
    chainCount > 0 ? correlationScoreTotal / chainCount : 0;

  const eventCountTotal = scoring.chains.reduce(
    (acc, c) => acc + (c.eventCount ?? 0),
    0,
  );

  const sourceCountTotal = scoring.chains.reduce(
    (acc, c) => acc + (c.sourceCount ?? 0),
    0,
  );

  const vulnerabilityDistribution = scoring.chains.reduce(
    (acc, c) => {
      acc[c.type] = (acc[c.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const severityHints = scoring.chains.map((c) => ({
    chainId: c.id,
    vuln: c.type,
    score: c.correlationScore ?? 0,
  }));

  const attackLikelihoodMax = Math.max(
    ...scoring.chains.map((c) => c.attackLikelihood ?? 0),
  );

  const attackLikelihoodAvg =
    chainCount > 0
      ? scoring.chains.reduce((acc, c) => acc + (c.attackLikelihood ?? 0), 0) /
        chainCount
      : 0;

  const mlFeatures = {
    chainCount,
    correlationScoreTotal,
    correlationScoreMax,
    correlationScoreAvg,
    eventCountTotal,
    sourceCountTotal,
    vulnerabilityDistribution,
    severityHints,
    attackLikelihoodMax,
    attackLikelihoodAvg,
  };

  const alerts = alertPipeline.run({
    ip,
    events,
    correlation: correlationFindings,
    scoring,
    mlFeatures,
  });

  return {
    ...scoring,
    alerts,
  };
}
