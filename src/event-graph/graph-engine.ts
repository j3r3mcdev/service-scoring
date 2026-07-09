import { EventGraph } from "./event-graph";
import { CorrelationFinding } from "../correlation/engine/pipeline/correlation-types";

export class GraphEngine {
  build(events: any[], findings: CorrelationFinding[]): EventGraph {
    const graph = new EventGraph();

    // Ajouter tous les événements comme nœuds
    for (const e of events) {
      graph.addNode(e);
    }

    // Ajouter les arêtes basées sur les findings
    for (const f of findings) {
      const evts = f.events;

      // Chaque finding relie ses événements entre eux
      for (let i = 0; i < evts.length - 1; i++) {
        graph.addEdge(evts[i].id, evts[i + 1].id, f.id, f.score);
      }
    }

    return graph;
  }
}
