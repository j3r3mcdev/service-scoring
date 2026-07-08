import { NormalizedEvent } from "@j3r3mcdev/scoring";

export class EntityRegistry {
  private entities = new Map<string, NormalizedEvent[]>();

  add(event: NormalizedEvent) {
    const ip = event.metadata?.ip ?? "unknown";
    if (!this.entities.has(ip)) {
      this.entities.set(ip, []);
    }
    this.entities.get(ip)!.push(event);
  }

  all() {
    return [...this.entities.entries()].map(([ip, events]) => ({
      ip,
      events,
    }));
  }
}
