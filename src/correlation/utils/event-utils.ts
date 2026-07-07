import { NormalizedEvent } from "@j3r3mcdev/scoring";

export function hasVuln(event: NormalizedEvent, vuln: string): boolean {
  return (
    event.metadata?.findings?.some((f: any) => f.vulnerability === vuln) ??
    false
  );
}

export function filterByVuln(
  events: NormalizedEvent[],
  vuln: string,
): NormalizedEvent[] {
  return events.filter((e) => hasVuln(e, vuln));
}

export function countVuln(events: NormalizedEvent[], vuln: string): number {
  return filterByVuln(events, vuln).length;
}

export function filterByIP(
  events: NormalizedEvent[],
  ip: string,
): NormalizedEvent[] {
  return events.filter((e) => e.metadata?.ip === ip);
}

export function sortByTimestamp(events: NormalizedEvent[]): NormalizedEvent[] {
  return [...events].sort((a, b) => a.timestamp - b.timestamp);
}

export function groupBy<T extends string | number>(
  events: NormalizedEvent[],
  key: (e: NormalizedEvent) => T,
): Record<T, NormalizedEvent[]> {
  return events.reduce(
    (acc, evt) => {
      const k = key(evt);
      if (!acc[k]) acc[k] = [];
      acc[k].push(evt);
      return acc;
    },
    {} as Record<T, NormalizedEvent[]>,
  );
}
