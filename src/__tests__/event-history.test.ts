import { EventHistoryStore } from "../storage/event-history";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect } from "@jest/globals";

function evt(ip: string, ts: number): NormalizedEvent {
  return {
    id: "evt",
    source: "http",
    timestamp: ts,
    payload: "",
    metadata: { ip, findings: [] },
  };
}

describe("EventHistoryStore", () => {
  it("stocke et récupère les events par IP", () => {
    const store = new EventHistoryStore({ ttlMs: 60000, maxEvents: 10 });

    store.add(evt("1.2.3.4", Date.now()));
    store.add(evt("1.2.3.4", Date.now()));

    const events = store.get("1.2.3.4");
    expect(events.length).toBe(2);
  });

  it("purge les events expirés", () => {
    const store = new EventHistoryStore({ ttlMs: 1000, maxEvents: 10 });

    store.add(evt("1.2.3.4", Date.now() - 2000));
    store.add(evt("1.2.3.4", Date.now()));

    const events = store.get("1.2.3.4");
    expect(events.length).toBe(1);
  });

  it("respecte la limite maxEvents", () => {
    const store = new EventHistoryStore({ ttlMs: 60000, maxEvents: 3 });

    store.add(evt("1.2.3.4", 1));
    store.add(evt("1.2.3.4", 2));
    store.add(evt("1.2.3.4", 3));
    store.add(evt("1.2.3.4", 4));

    const events = store.get("1.2.3.4");
    expect(events.length).toBe(3);
    expect(events[0].timestamp).toBe(2); // le plus ancien a été purgé
  });
});
