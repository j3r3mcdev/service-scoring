import { adaptEvent } from "../adapters/event-adapter";
import { HttpNormalizer } from "@j3r3mcdev/scoring";

jest.mock("@j3r3mcdev/scoring", () => ({
  HttpNormalizer: {
    normalize: jest.fn((req) => ({
      id: "normalized",
      source: "http",
      timestamp: 123,
      payload: req.body,
      metadata: {
        method: req.method,
        path: req.url,
        headers: req.headers,
        query: req.query,
        ip: req.socket.remoteAddress,
      },
    })),
  },
}));

describe("event-adapter", () => {
  it("normalise un event HTTP complet", () => {
    const raw = {
      method: "POST",
      path: "/login",
      headers: { "x-test": "ok" },
      query: { a: 1 },
      body: "hello",
      ip: "1.2.3.4",
    };

    const evt = adaptEvent(raw);

    expect(evt.metadata.method).toBe("POST");
    expect(evt.metadata.path).toBe("/login");
    expect(evt.metadata.headers["x-test"]).toBe("ok");
    expect(evt.metadata.query.a).toBe(1);
    expect(evt.payload).toBe("hello");
    expect(evt.metadata.ip).toBe("1.2.3.4");
  });

  it("utilise GET par défaut", () => {
    expect(adaptEvent({}).metadata.method).toBe("GET");
  });

  it("utilise / par défaut", () => {
    expect(adaptEvent({}).metadata.path).toBe("/");
  });

  it("utilise {} pour headers absents", () => {
    expect(adaptEvent({}).metadata.headers).toEqual({});
  });

  it("utilise {} pour query absente", () => {
    expect(adaptEvent({}).metadata.query).toEqual({});
  });

  it("utilise body si présent", () => {
    expect(adaptEvent({ body: "abc" }).payload).toBe("abc");
  });

  it("utilise payload si body absent", () => {
    expect(adaptEvent({ payload: "xyz" }).payload).toBe("xyz");
  });

  it("utilise null si body et payload absents", () => {
    expect(adaptEvent({}).payload).toBe(null);
  });

  it("utilise unknown si ip absente", () => {
    expect(adaptEvent({}).metadata.ip).toBe("unknown");
  });
});
