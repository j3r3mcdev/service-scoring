import request from "supertest";
import express from "express";
import { MultiEventController } from "../api/multi-event.controller";
import { multiEventPipeline } from "../correlation/engine/pipeline/multi-event-pipeline";
import { NormalizedEvent } from "@j3r3mcdev/scoring";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("../correlation/engine/pipeline/multi-event-pipeline");
const mockedPipeline = multiEventPipeline as jest.Mock;

describe("MultiEventController.handleBatch", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const controller = new MultiEventController();
    app.post("/batch", (req, res) => controller.handleBatch(req, res));

    mockedPipeline.mockReset();
  });

  it("renvoie 400 si payload invalide (pas un tableau)", async () => {
    const res = await request(app)
      .post("/batch")
      .send({ events: "not-an-array" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "Invalid payload: expected { events: NormalizedEvent[] }",
    );
  });

  it("renvoie 400 si un event n'a pas de timestamp", async () => {
    const res = await request(app)
      .post("/batch")
      .send({
        events: [
          {
            id: "evt-1",
            source: "http",
            metadata: {},
            payload: "{}",
            // timestamp manquant → invalide
          },
        ],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid event format");
  });

  it("appelle le pipeline avec des events valides", async () => {
    const events: NormalizedEvent[] = [
      {
        id: "evt-1",
        source: "http",
        timestamp: Date.now(),
        payload: "{}",
        metadata: { ip: "1.2.3.4" },
      },
      {
        id: "evt-2",
        source: "dns",
        timestamp: Date.now(),
        payload: "{}",
        metadata: { domain: "example.com" },
      },
    ];

    mockedPipeline.mockReturnValue({ score: 42 });

    const res = await request(app).post("/batch").send({ events });

    expect(mockedPipeline).toHaveBeenCalledTimes(1);
    expect(mockedPipeline).toHaveBeenCalledWith(events);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.score).toBe(42);
  });

  it("renvoie 500 si le pipeline throw une erreur", async () => {
    mockedPipeline.mockImplementation(() => {
      throw new Error("boom");
    });

    const events: NormalizedEvent[] = [
      {
        id: "evt-1",
        source: "http",
        timestamp: Date.now(),
        payload: "{}",
        metadata: {},
      },
    ];

    const res = await request(app).post("/batch").send({ events });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal error");
    expect(res.body.details).toBe("boom");
  });
});
