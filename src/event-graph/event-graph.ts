import { NormalizedEvent } from "@j3r3mcdev/scoring";

export interface GraphNode {
  id: string;
  event: NormalizedEvent;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: string;
  weight: number;
}

export class EventGraph {
  nodes = new Map<string, GraphNode>();
  edges: GraphEdge[] = [];

  addNode(event: NormalizedEvent) {
    if (!this.nodes.has(event.id)) {
      this.nodes.set(event.id, { id: event.id, event });
    }
  }

  addEdge(from: string, to: string, type: string, weight: number) {
    this.edges.push({ from, to, type, weight });
  }

  getNode(id: string) {
    return this.nodes.get(id);
  }

  getEdgesFrom(id: string) {
    return this.edges.filter((e) => e.from === id);
  }

  getEdgesTo(id: string) {
    return this.edges.filter((e) => e.to === id);
  }
}
