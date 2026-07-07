import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { sortByTimestamp } from "../utils/event-utils";

export interface TimeWindow {
  start: number;
  end: number;
  events: NormalizedEvent[];
}

export class WindowEngine {
  constructor(private windowSizeMs: number = 30000) {} // 30s par défaut

  buildWindows(events: NormalizedEvent[]): TimeWindow[] {
    const sorted = sortByTimestamp(events);
    const windows: TimeWindow[] = [];

    let current: TimeWindow | null = null;

    for (const evt of sorted) {
      if (!current) {
        current = {
          start: evt.timestamp,
          end: evt.timestamp + this.windowSizeMs,
          events: [evt],
        };
        continue;
      }

      if (evt.timestamp <= current.end) {
        current.events.push(evt);
      } else {
        windows.push(current);
        current = {
          start: evt.timestamp,
          end: evt.timestamp + this.windowSizeMs,
          events: [evt],
        };
      }
    }

    if (current) windows.push(current);

    return windows;
  }
}
