import { scoringPipeline } from "../../../../pipelines/scoring-pipeline";
import { adaptEvent } from "../../../../adapters/event-adapter";
import { ScoringEngine } from "@j3r3mcdev/scoring";
import { CorrelationEngine } from "../../../correlation-engine";

jest.mock("../../../../adapters/event-adapter");
jest.mock("@j3r3mcdev/scoring");
jest.mock("../../../correlation-engine");

describe("correlation-integration", () => {
  it("pipeline scoring + corrélation fonctionne", () => {
    const raw = { foo: "bar" };
    const adapted = { id: "normalized" };

    (adaptEvent as jest.Mock).mockReturnValue(adapted);

    const scoringInstance = {
      run: jest.fn().mockReturnValue({ score: 42 }),
    };
    (ScoringEngine as jest.Mock).mockImplementation(() => scoringInstance);

    const correlationInstance = {
      run: jest.fn().mockReturnValue([{ id: "full-intrusion-chain" }]),
    };
    (CorrelationEngine as jest.Mock).mockImplementation(
      () => correlationInstance,
    );

    const result = scoringPipeline(raw);

    expect(result.score).toBe(42);
    expect(result.correlation).toEqual([{ id: "full-intrusion-chain" }]);
    expect(adaptEvent).toHaveBeenCalledWith(raw);
    expect(scoringInstance.run).toHaveBeenCalled();
    expect(correlationInstance.run).toHaveBeenCalledWith([adapted]);
  });
});
