import { ScoringEngine } from "../engine/scoring-engine";
import { normalizeEvent } from "@j3r3mcdev/scoring";

jest.mock("@j3r3mcdev/scoring", () => {
  const actual = jest.requireActual("@j3r3mcdev/scoring");
  return {
    ...actual,
    normalizeEvent: jest.fn((_source: any, raw: any) => ({
      id: "evt-1",
      source: "http",
      timestamp: Date.now(),
      payload: typeof raw === "string" ? raw : JSON.stringify(raw),
      metadata: {},
    })),
  };
});

describe("ScoringEngine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("compile et retourne un ScoringResult conforme", () => {
    const event = { foo: "bar" };

    const result = ScoringEngine.run(event);

    // Vérifie que normalizeEvent est bien appelé
    expect(normalizeEvent).toHaveBeenCalledWith("http", event);

    // Vérifie la structure du résultat
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("severity");
    expect(result).toHaveProperty("findings");
    expect(result).toHaveProperty("chains");
    expect(result).toHaveProperty("timestamp");

    // Pour un event neutre : pas de findings
    expect(result.findings).toHaveLength(0);
    expect(result.score).toBe(0);

    // Severity minimale
    expect(result.severity).toBe("low");
  });
});
