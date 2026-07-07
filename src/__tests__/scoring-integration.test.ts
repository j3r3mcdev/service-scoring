import { scoringController } from "../api/scoring.controller";

describe("Service-Scoring — Intégration complète", () => {
  it("détecte une attaque SQLi via le controller", () => {
    const event = {
      method: "GET",
      path: "/search",
      payload: "q=' OR 1=1 --",
    };

    const result = scoringController.score(event);

    const sqliFinding = result.findings.find((f) => f.vulnerability === "sqli");

    expect(sqliFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });

  it("détecte une attaque XSS via le controller", () => {
    const event = {
      method: "POST",
      path: "/comment",
      payload: "<script>alert('xss')</script>",
    };

    const result = scoringController.score(event);

    const xssFinding = result.findings.find((f) => f.vulnerability === "xss");

    expect(xssFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });

  it("détecte une tentative RCE via le controller", () => {
    const event = {
      method: "POST",
      path: "/exec",
      payload: "system('ls')",
    };

    const result = scoringController.score(event);

    const rceFinding = result.findings.find((f) => f.vulnerability === "rce");

    expect(rceFinding).toBeDefined();
    expect(result.score).toBeGreaterThan(0);
  });
});
