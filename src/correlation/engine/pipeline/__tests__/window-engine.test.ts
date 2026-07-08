import { WindowEngine } from "../../../windowing/window-engine";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

function evt(ts: number): NormalizedEvent {
  return {
    id: "evt",
    source: "http",
    timestamp: ts,
    payload: "",
    metadata: { ip: "1.2.3.4", findings: [] },
  };
}

describe("WindowEngine", () => {
  it("crée plusieurs fenêtres", () => {
    const engine = new WindowEngine(1000);

    const events = [evt(1000), evt(1500), evt(3000)];
    const windows = engine.buildWindows(events);

    expect(windows.length).toBe(2);
    expect(windows[0].events.length).toBe(2);
    expect(windows[1].events.length).toBe(1);
  });

  it("crée une seule fenêtre si tout est proche", () => {
    const engine = new WindowEngine(5000);

    const events = [evt(1000), evt(2000), evt(3000)];
    const windows = engine.buildWindows(events);

    expect(windows.length).toBe(1);
    expect(windows[0].events.length).toBe(3);
  });
});
