import { describe, it, expect } from "@jest/globals";

import { Request } from "express";
import { adaptEvent } from "../adapters/event-adapter"; // ton adapter réel

describe("event-adapter", () => {
  it("adapts a basic request", () => {
    const req = {
      body: {
        path: "/test",
        method: "GET",
      },
      headers: {
        "user-agent": "jest-test",
      },
      ip: "127.0.0.1",
    } as unknown as Request;

    const evt = adaptEvent(req);

    expect(evt.source).toBe("http");
    expect(evt.metadata).toBeDefined();
  });

  it("handles missing fields", () => {
    const req = {
      body: {},
      headers: {},
      ip: "127.0.0.1",
    } as unknown as Request;

    const evt = adaptEvent(req);

    expect(evt.metadata).toBeDefined();
  });
});
