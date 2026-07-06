export function adaptEvent(raw: any) {
  return {
    ...raw,
    timestamp: raw.timestamp ?? Date.now(),
  };
}
