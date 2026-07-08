import { Request, Response } from "express";
import { multiEventPipeline } from "../pipelines/multi-event-pipeline";
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

      const result = multiEventPipeline(events as NormalizedEvent[]);

      return res.status(200).json({
        ok: true,
        ...result,
      });
    } catch (err: any) {
      return res.status(500).json({
        error: "Internal error",
        details: err?.message,
      });
    }
  }
}
