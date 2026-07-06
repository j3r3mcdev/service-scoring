import { scoringController } from "../api/scoring.controller";
import { ScoringEngine } from "../engine/scoring-engine";
import { adaptEvent } from "../adapters/event-adapter";

jest.mock("../engine/scoring-engine");
jest.mock("../adapters/event-adapter");

describe("scoringController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adapte l’événement avant scoring", () => {
    const rawEvent = { foo: "bar" };
    const adapted = { foo: "adapted" };

    (adaptEvent as jest.Mock).mockReturnValue(adapted);
    (ScoringEngine.run as jest.Mock).mockReturnValue({ score: 0 });

    scoringController.score(rawEvent);

    expect(adaptEvent).toHaveBeenCalledWith(rawEvent);
  });

  it("appelle ScoringEngine.run avec l’événement adapté", () => {
    const rawEvent = { foo: "bar" };
    const adapted = { foo: "adapted" };

    (adaptEvent as jest.Mock).mockReturnValue(adapted);
    (ScoringEngine.run as jest.Mock).mockReturnValue({ score: 0 });

    scoringController.score(rawEvent);

    expect(ScoringEngine.run).toHaveBeenCalledWith(adapted);
  });

  it("retourne le résultat du moteur de scoring", () => {
    const rawEvent = { foo: "bar" };
    const adapted = { foo: "adapted" };
    const scoringResult = { score: 42 };

    (adaptEvent as jest.Mock).mockReturnValue(adapted);
    (ScoringEngine.run as jest.Mock).mockReturnValue(scoringResult);

    const result = scoringController.score(rawEvent);

    expect(result).toBe(scoringResult);
  });
});
