import request from "supertest";
import express from "express";
import multiEventRoutes from "../api/multi-event.routes";

function evt(vuln: string, ts: number) {
  return {
    id: "evt",
    source: "http",
    timestamp: ts,
    payload: "",
    metadata: {
      ip: "127.0.0.1",
      findings: [
        {
          id: "rule",
          vulnerability: vuln,
          severity: "medium",
          score: 0.5,
          evidence: [],
          chains: [],
          details: "",
        },
      ],
    },
  };
}

describe("multi-event.controller", () => {
  const app = express();
  app.use(express.json());
  app.use("/api", multiEventRoutes);

  it("retourne un résultat global pour un batch d'événements", async () => {
    const res = await request(app)
      .post("/api/scoring/batch")
      .send({
        events: [
          evt("dns", 1000),
          evt("path-traversal", 2000),
          evt("rce", 3000),
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.events.length).toBe(3);
    expect(res.body.globalScore).toBeDefined();
  });

  it("retourne une erreur si payload invalide", async () => {
    const res = await request(app)
      .post("/api/scoring/batch")
      .send({ events: "not-an-array" });

    expect(res.status).toBe(400);
  });
});
