import { describe, it, expect } from "@jest/globals";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

import { ProfilingEngine } from "../ueba-profiling";
import { DeviationEngine } from "../ueba-deviation";
import { UEBAEngine } from "../ueba-engine";

/**
 * Génère un événement valide selon @j3r3mcdev/scoring
 */
const makeEvent = (
  id: string,
  source: "http" | "dns" | "waf" | "scan" | "oast",
  protocol?: string,
  payload?: string,
): NormalizedEvent => ({
  id,
  source,
  timestamp: Date.now(),
  protocol,
  payload,
  metadata: {},
});

describe("UEBA ProfilingEngine", () => {
  it("construit un profil avec les sources, protocoles et patterns", () => {
    const events = [
      makeEvent("e1", "http", "GET", "abc123"),
      makeEvent("e2", "dns", undefined, "xyz789"),
      makeEvent("e3", "http", "POST", "abc999"),
    ];

    const profiling = new ProfilingEngine();
    const profile = profiling.buildProfile(events);

    expect(profile.sources.size).toBe(2);
    expect(profile.protocols.size).toBe(2);
    expect(profile.payloadPatterns.size).toBe(2);
    expect(profile.eventCount).toBe(3);
  });
});

describe("UEBA DeviationEngine", () => {
  it("détecte une nouvelle source jamais vue dans le profil", () => {
    const events = [makeEvent("e1", "http"), makeEvent("e2", "dns")];

    const profiling = new ProfilingEngine();
    const profile = profiling.buildProfile(events);

    const deviationEngine = new DeviationEngine();
    const deviations = deviationEngine.detect(profile, [
      makeEvent("e3", "oast"), // nouvelle source
    ]);

    expect(deviations.length).toBe(1);
    expect(deviations[0].type).toBe("new-source");
  });

  it("détecte un nouveau protocole jamais vu", () => {
    const events = [makeEvent("e1", "http", "GET")];

    const profiling = new ProfilingEngine();
    const profile = profiling.buildProfile(events);

    const deviationEngine = new DeviationEngine();
    const deviations = deviationEngine.detect(profile, [
      makeEvent("e2", "http", "POST"), // nouveau protocole
    ]);

    expect(deviations.length).toBe(1);
    expect(deviations[0].type).toBe("new-protocol");
  });

  it("détecte un nouveau pattern de payload", () => {
    const events = [makeEvent("e1", "http", undefined, "abc123")];

    const profiling = new ProfilingEngine();
    const profile = profiling.buildProfile(events);

    const deviationEngine = new DeviationEngine();
    const deviations = deviationEngine.detect(profile, [
      makeEvent("e2", "http", undefined, "zzz999"), // nouveau pattern
    ]);

    expect(deviations.length).toBe(1);
    expect(deviations[0].type).toBe("new-payload-pattern");
  });
});

describe("UEBAEngine", () => {
  it("retourne des findings UEBA pour chaque anomalie détectée", () => {
    const events = [
      makeEvent("e1", "http", "GET", "abc123"),
      makeEvent("e2", "dns", undefined, "xyz789"),
      makeEvent("e3", "oast", "POST", "zzz999"), // 3 anomalies
    ];

    const uebaEngine = new UEBAEngine();
    const findings = uebaEngine.run(events);

    expect(findings.length).toBeGreaterThanOrEqual(3);

    const types = findings.map((f) => f.metadata?.anomalyType);

    expect(types).toContain("new-source");
    expect(types).toContain("new-protocol");
    expect(types).toContain("new-payload-pattern");
  });

  it("retourne des findings avec les bons champs", () => {
    const events = [
      makeEvent("e1", "http"),
      makeEvent("e2", "oast"), // nouvelle source
    ];

    const uebaEngine = new UEBAEngine();
    const findings = uebaEngine.run(events);

    const f = findings[0];

    expect(f.id).toContain("ueba-");
    expect(f.severity).toBe("medium");
    expect(f.score).toBeGreaterThan(0);
    expect(f.events.length).toBe(1);
    expect(f.metadata?.profile).toBeDefined();
  });
});
