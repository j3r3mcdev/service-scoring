import { computeAttackLikelihood } from "../probabilistic-correlation";
import { CorrelationChain } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

function makeChain(partial: Partial<CorrelationChain>): CorrelationChain {
  return {
    id: partial.id ?? "test",
    type: partial.type ?? "http",
    confidence: partial.confidence ?? 0,
    events: partial.events ?? [],
    eventCount: partial.eventCount,
    sourceCount: partial.sourceCount,
    correlationScore: partial.correlationScore,
    attackLikelihood: partial.attackLikelihood,
  };
}

describe("computeAttackLikelihood", () => {
  it("retourne un score faible pour une chaîne simple et peu grave", () => {
    const now = Date.now();
    const chain = makeChain({
      type: "http",
      events: [{ id: "e1", source: "ip1", timestamp: now } as any],
    });

    const likelihood = computeAttackLikelihood(chain);

    expect(likelihood).toBeGreaterThanOrEqual(0);
    expect(likelihood).toBeLessThan(0.5);
  });

  it("retourne un score élevé pour une chaîne RCE multi‑source et dense", () => {
    const now = Date.now();
    const chain = makeChain({
      type: "rce",
      events: [
        { id: "e1", source: "ip1", timestamp: now } as any,
        { id: "e2", source: "ip2", timestamp: now + 1_000 } as any,
        { id: "e3", source: "ip3", timestamp: now + 2_000 } as any,
        { id: "e4", source: "ip1", timestamp: now + 3_000 } as any,
        { id: "e5", source: "ip2", timestamp: now + 4_000 } as any,
        { id: "e6", source: "ip3", timestamp: now + 5_000 } as any,
        { id: "e7", source: "ip1", timestamp: now + 6_000 } as any,
        { id: "e8", source: "ip2", timestamp: now + 7_000 } as any,
        { id: "e9", source: "ip3", timestamp: now + 8_000 } as any,
        { id: "e10", source: "ip1", timestamp: now + 9_000 } as any,
      ],
    });

    const likelihood = computeAttackLikelihood(chain);

    expect(likelihood).toBeGreaterThan(0.7);
    expect(likelihood).toBeLessThanOrEqual(1);
  });

  it("gère correctement les chaînes sans timestamps", () => {
    const chain = makeChain({
      type: "sqli",
      events: [
        { id: "e1", source: "ip1" } as any,
        { id: "e2", source: "ip1" } as any,
      ],
    });

    const likelihood = computeAttackLikelihood(chain);

    expect(likelihood).toBeGreaterThanOrEqual(0);
    expect(likelihood).toBeLessThanOrEqual(1);
  });

  it("sature les facteurs d'événements et de sources", () => {
    const now = Date.now();
    const events = Array.from({ length: 50 }).map((_, i) => ({
      id: `e${i}`,
      source: `ip${i % 10}`,
      timestamp: now + i * 1_000,
    })) as any[];

    const chain = makeChain({
      type: "ssrf",
      events,
    });

    const likelihood = computeAttackLikelihood(chain);

    expect(likelihood).toBeGreaterThan(0.8);
    expect(likelihood).toBeLessThanOrEqual(1);
  });
});
