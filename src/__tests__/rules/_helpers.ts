import { NormalizedEvent, EventSource } from "@j3r3mcdev/scoring";

export function mockEvent(
  payload: string,
  source: EventSource = "http",
): NormalizedEvent {
  return {
    id: "evt-test",
    source,
    timestamp: Date.now(),
    payload,
    metadata: {},
  };
}

export function mockContext(payload: string, source: EventSource = "http") {
  return {
    events: [mockEvent(payload, source)],
    chains: [],
    metadata: {},
  };
}
