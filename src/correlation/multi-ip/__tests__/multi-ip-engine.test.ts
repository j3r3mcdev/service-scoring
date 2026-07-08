import { MultiIPCorrelationEngine } from "../../multi-ip/multi-ip-engine";
import { EntityRegistry } from "../../multi-ip/entity-registry";
import { EventSource, NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

describe("Multi-IP Correlation Engine", () => {
  const makeEvent = (ip: string, vuln: string): NormalizedEvent => ({
    id: `${ip}-${vuln}`,
    source: "test" as EventSource,
    timestamp: Date.now(),
    metadata: {
      ip,
      findings: [{ vulnerability: vuln, severity: "high", score: 5 }],
    },
  });

  it("détecte un pivot latéral entre deux IP", () => {
    const registry = new EntityRegistry();

    registry.add(makeEvent("10.0.0.1", "ssrf"));
    registry.add(makeEvent("10.0.0.2", "rce"));

    const engine = new MultiIPCorrelationEngine();
    const findings = engine.run(registry);

    expect(findings.length).toBe(1);
    expect(findings[0].id).toBe("lateral-pivot");
    expect(findings[0].metadata.sourceIP).toBe("10.0.0.1");
    expect(findings[0].metadata.targetIP).toBe("10.0.0.2");
  });

  it("ne détecte rien si une seule IP", () => {
    const registry = new EntityRegistry();

    registry.add(makeEvent("10.0.0.1", "ssrf"));
    registry.add(makeEvent("10.0.0.1", "rce"));

    const engine = new MultiIPCorrelationEngine();
    const findings = engine.run(registry);

    expect(findings.length).toBe(0);
  });

  it("ne détecte rien si les vulnérabilités ne matchent pas", () => {
    const registry = new EntityRegistry();

    registry.add(makeEvent("10.0.0.1", "xss"));
    registry.add(makeEvent("10.0.0.2", "csrf"));

    const engine = new MultiIPCorrelationEngine();
    const findings = engine.run(registry);

    expect(findings.length).toBe(0);
  });
});
