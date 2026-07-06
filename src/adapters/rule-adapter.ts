export function adaptRules(rules: any[]) {
  return rules.map((r) => ({
    id: r.id,
    weight: r.weight ?? 1,
    conditions: r.conditions ?? [],
  }));
}
