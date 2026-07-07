import { scoringController } from "../api/scoring.controller";
import { adaptEvent } from "../adapters/event-adapter";
import { ScoringEngine } from "@j3r3mcdev/scoring";

jest.mock("../adapters/event-adapter");
jest.mock("@j3r3mcdev/scoring");

describe("scoringController", () => {
  it("adapte l’event et appelle le moteur", () => {
    const raw = { foo: "bar" };
    const adapted = { id: "normalized", metadata: {} };

    (adaptEvent as jest.Mock).mockReturnValue(adapted);

    const engineInstance = {
      run: jest.fn().mockReturnValue({ score: 99 }),
    };

    (ScoringEngine as jest.Mock).mockImplementation(() => engineInstance);

    const result = scoringController.score(raw);

    expect(adaptEvent).toHaveBeenCalledWith(raw);
    expect(engineInstance.run).toHaveBeenCalled();
    expect(result.score).toBe(99);
  });
});
