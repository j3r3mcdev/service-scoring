import { GraphEngine } from "../../event-graph/graph-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { CorrelationFinding } from "../..//correlation/correlation-types";
import { describe, it, expect } from "@jest/globals";

/**
 * Génère un événement valide selon @j3r3mcdev/scoring
 */
const makeEvent = (id: string): NormalizedEvent => ({
  id,
  source: "scan", // ✔ valeur valide de EventSource
  timestamp: Date.now(),
  metadata: {},
});

/**
 * Génère un finding valide pour les tests
 */
const makeFinding = (
  id: string,
  events: NormalizedEvent[],
): CorrelationFinding => ({
  id,
  description: id,
  severity: "high",
  score: 5,
  events,
  metadata: {},
});

describe("GraphEngine", () => {
  it("crée un nœud pour chaque événement", () => {
    const events = [makeEvent("e1"), makeEvent("e2")];
    const findings: CorrelationFinding[] = [];

    const graph = new GraphEngine().build(events, findings);

    expect(graph.nodes.size).toBe(2);
    expect(graph.getNode("e1")).toBeDefined();
    expect(graph.getNode("e2")).toBeDefined();
  });

  it("crée une arête pour un finding reliant deux événements", () => {
    const e1 = makeEvent("e1");
    const e2 = makeEvent("e2");

    const finding = makeFinding("sqli", [e1, e2]);

    const graph = new GraphEngine().build([e1, e2], [finding]);

    expect(graph.edges.length).toBe(1);
    expect(graph.edges[0].from).toBe("e1");
    expect(graph.edges[0].to).toBe("e2");
    expect(graph.edges[0].type).toBe("sqli");
    expect(graph.edges[0].weight).toBe(5);
  });

  it("crée plusieurs arêtes pour plusieurs findings", () => {
    const e1 = makeEvent("e1");
    const e2 = makeEvent("e2");
    const e3 = makeEvent("e3");

    const f1 = makeFinding("sqli", [e1, e2]);
    const f2 = makeFinding("rce", [e2, e3]);

    const graph = new GraphEngine().build([e1, e2, e3], [f1, f2]);

    expect(graph.edges.length).toBe(2);

    expect(graph.edges[0].type).toBe("sqli");
    expect(graph.edges[1].type).toBe("rce");
  });

  it("ne crée aucune arête si un finding ne contient qu’un seul événement", () => {
    const e1 = makeEvent("e1");
    const finding = makeFinding("xss", [e1]);

    const graph = new GraphEngine().build([e1], [finding]);

    expect(graph.edges.length).toBe(0);
  });

  it("gère correctement les edges sortants et entrants", () => {
    const e1 = makeEvent("e1");
    const e2 = makeEvent("e2");
    const e3 = makeEvent("e3");

    const f1 = makeFinding("sqli", [e1, e2]);
    const f2 = makeFinding("rce", [e2, e3]);

    const graph = new GraphEngine().build([e1, e2, e3], [f1, f2]);

    const edgesFromE2 = graph.getEdgesFrom("e2");
    const edgesToE2 = graph.getEdgesTo("e2");

    expect(edgesFromE2.length).toBe(1);
    expect(edgesFromE2[0].to).toBe("e3");

    expect(edgesToE2.length).toBe(1);
    expect(edgesToE2[0].from).toBe("e1");
  });

  it("supporte des findings complexes avec plus de deux événements", () => {
    const e1 = makeEvent("e1");
    const e2 = makeEvent("e2");
    const e3 = makeEvent("e3");
    const e4 = makeEvent("e4");

    const finding = makeFinding("path_traversal", [e1, e2, e3, e4]);

    const graph = new GraphEngine().build([e1, e2, e3, e4], [finding]);

    expect(graph.edges.length).toBe(3);

    expect(graph.edges[0].from).toBe("e1");
    expect(graph.edges[0].to).toBe("e2");

    expect(graph.edges[1].from).toBe("e2");
    expect(graph.edges[1].to).toBe("e3");

    expect(graph.edges[2].from).toBe("e3");
    expect(graph.edges[2].to).toBe("e4");
  });
});
