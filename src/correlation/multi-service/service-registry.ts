import { NormalizedEvent } from "@j3r3mcdev/scoring";

export class ServiceRegistry {
  private services = new Map<string, NormalizedEvent[]>();

  add(event: NormalizedEvent) {
    const service = event.metadata?.service ?? "unknown";
    if (!this.services.has(service)) {
      this.services.set(service, []);
    }
    this.services.get(service)!.push(event);
  }

  all() {
    return [...this.services.entries()].map(([service, events]) => ({
      service,
      events,
    }));
  }
}
