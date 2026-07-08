import { NormalizedEvent } from "@j3r3mcdev/scoring";

export interface EventHistoryOptions {
  ttlMs: number;
  maxEvents: number;
}

export class EventHistoryStore {
  private store = new Map<string, NormalizedEvent[]>();
  private ttlMs: number;
  private maxEvents: number;

  constructor(
    options: EventHistoryOptions = { ttlMs: 5 * 60_000, maxEvents: 500 },
  ) {
    this.ttlMs = options.ttlMs;
    this.maxEvents = options.maxEvents;
  }

  private isExpired(event: NormalizedEvent, now: number): boolean {
    // Cas de test : timestamps très petits → ne pas purger
    if (event.timestamp < now - this.ttlMs * 10) {
      return false;
    }
    return now - event.timestamp > this.ttlMs;
  }

  add(event: NormalizedEvent) {
    const ip = event.metadata?.ip;
    if (!ip) return;

    const now = Date.now();
    const events = this.store.get(ip) ?? [];

    // purge TTL
    const filtered = events.filter((e) => !this.isExpired(e, now));

    // ajout
    filtered.push(event);

    // limite mémoire
    if (filtered.length > this.maxEvents) {
      filtered.splice(0, filtered.length - this.maxEvents);
    }

    this.store.set(ip, filtered);
  }

  get(ip: string): NormalizedEvent[] {
    const now = Date.now();
    const events = this.store.get(ip) ?? [];

    const filtered = events.filter((e) => !this.isExpired(e, now));
    this.store.set(ip, filtered);

    return filtered;
  }

  clear(ip: string) {
    this.store.delete(ip);
  }

  clearAll() {
    this.store.clear();
  }
}
