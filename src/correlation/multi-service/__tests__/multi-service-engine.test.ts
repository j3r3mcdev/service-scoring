import { MultiServiceCorrelationEngine } from "../../multi-service/multi-service-engine";
import { ServiceRegistry } from "../../multi-service/service-registry";
import { EventSource, NormalizedEvent, Finding } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

describe("Multi-Service Correlation Engine", () => {
  const makeEvent = (
    service: string,
    vuln: Finding["vulnerability"],
  ): NormalizedEvent => ({
    id: `${service}-${vuln}-${Date.now()}`,
    source: "test" as EventSource,
    timestamp: Date.now(),
    metadata: {
      service,
      findings: [
        {
          vulnerability: vuln,
          severity: "high",
          score: 5,
        },
      ],
    },
  });

  it("détecte un flow suspect entre deux services", () => {
    const registry = new ServiceRegistry();

    // HTTP → API flow suspect
    registry.add(makeEvent("http", "sqli"));
    registry.add(makeEvent("api", "rce"));

    const engine = new MultiServiceCorrelationEngine();
    const findings = engine.run(registry);

    expect(findings.length).toBe(1);
    expect(findings[0].id).toBe("http-api-suspicious-flow");
    expect(findings[0].metadata.sourceService).toBe("http");
    expect(findings[0].metadata.targetService).toBe("api");
  });

  it("ne détecte rien si un seul service est présent", () => {
    const registry = new ServiceRegistry();

    registry.add(makeEvent("http", "sqli"));
    registry.add(makeEvent("http", "rce"));

    const engine = new MultiServiceCorrelationEngine();
    const findings = engine.run(registry);

    expect(findings.length).toBe(0);
  });

  it("ne détecte rien si les vulnérabilités ne matchent pas", () => {
    const registry = new ServiceRegistry();

    registry.add(makeEvent("http", "xss"));
    registry.add(makeEvent("api", "dns"));

    const engine = new MultiServiceCorrelationEngine();
    const findings = engine.run(registry);

    expect(findings.length).toBe(0);
  });
});
