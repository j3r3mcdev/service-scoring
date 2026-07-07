import { scoringController } from "../api/scoring.controller";
import { Finding } from "@j3r3mcdev/scoring";

describe("Service-Scoring — Intégration complète", () => {
  it("détecte une attaque SQLi via le controller", () => {
    const event = {
      method: "GET",
      path: "/search",
      payload: "q=' OR 1=1 --",
      headers: { "user-agent": "Mozilla" },
    };

    const result = scoringController.score(event);

    const sqliFinding = (result.findings as Finding[]).find((f) =>
      f.id.includes("sqli"),
    );

    expect(sqliFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });

  it("détecte une attaque XSS via le controller", () => {
    const event = {
      method: "POST",
      path: "/comment",
      payload: "<script>alert('xss')</script>",
      headers: { "user-agent": "Mozilla" },
    };

    const result = scoringController.score(event);

    const xssFinding = (result.findings as Finding[]).find((f) =>
      f.id.includes("xss"),
    );

    expect(xssFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });

  it("détecte une tentative RCE via le controller", () => {
    const event = {
      method: "GET",
      path: "/",
      payload: "cmd=ls",
      headers: { "user-agent": "curl" },
    };

    const result = scoringController.score(event);

    const rceFinding = (result.findings as Finding[]).find((f) =>
      f.id.includes("rce"),
    );

    expect(rceFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });
});
