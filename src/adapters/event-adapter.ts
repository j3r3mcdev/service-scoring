import { HttpNormalizer } from "@j3r3mcdev/scoring";

export function adaptEvent(raw: any) {
  const req = {
    method: raw.method ?? "GET",
    url: raw.path ?? "/",
    headers: raw.headers ?? {},
    query: raw.query ?? {},
    body: raw.body ?? raw.payload ?? null,
    socket: { remoteAddress: raw.ip ?? "unknown" },
  };

  return HttpNormalizer.normalize(req);
}
