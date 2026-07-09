import { Request, Response } from "express";
import { scoringPipeline } from "../correlation/engine/pipeline/scoring-pipeline";
import { NormalizedEvent } from "@j3r3mcdev/scoring";

export class MultiEventController {
  async handleBatch(req: Request, res: Response) {
    try {
      const events = req.body?.events;

      if (!Array.isArray(events)) {
        return res.status(400).json({
          error: "Invalid payload: expected { events: NormalizedEvent[] }",
        });
      }

      for (const evt of events) {
        if (typeof evt !== "object" || !evt.timestamp) {
          return res.status(400).json({
            error: "Invalid event format",
          });
        }
      }

      const result = scoringPipeline(events as NormalizedEvent[]);

      return res.status(200).json({
        ok: true,
        ...result,
        score: result.score ?? 0,
      });
    } catch (err: any) {
      return res.status(500).json({
        error: "Internal error",
        details: err?.message,
      });
    }
  }
}
