import { ScoringEngine } from "../engine/scoring-engine";
import { normalizeEvent, createEmptyResult } from "@j3r3mcdev/scoring";

jest.mock("@j3r3mcdev/scoring", () => ({
  normalizeEvent: jest.fn(),
  createEmptyContext: jest.fn(() => ({
    events: [],
    chains: [],
    metadata: {},
  })),
  createEmptyResult: jest.fn(() => ({
    score: 0,
    severity: 0,
    findings: [],
    chains: [],
    timestamp: "",
  })),
  RuleRegistry: {
    getAll: jest.fn(() => []),
  },
}));

describe("ScoringEngine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("compile et retourne un résultat", () => {
    const event = { foo: "bar" };

    (normalizeEvent as jest.Mock).mockReturnValue({ normalized: true });

    const result = ScoringEngine.run(event);

    expect(result).toEqual(createEmptyResult());
    expect(normalizeEvent).toHaveBeenCalledWith(event, event);
  });
});
