import { NormalizedEvent, Severity } from "@j3r3mcdev/scoring";

export interface AdvancedPattern {
  id: string;
  description: string;
  severity: Severity;
  score: number;
  detect(events: NormalizedEvent[]): boolean;
}

function vulnOf(e: NormalizedEvent): string | undefined {
  return e.metadata?.findings?.[0]?.vulnerability;
}

/**
 * ─────────────────────────────────────────────────────────────
 *  WINDOWING PATTERNS — alignés sur les tests
 * ─────────────────────────────────────────────────────────────
 */

export const slowReconnaissancePattern: AdvancedPattern = {
  id: "slow-reconnaissance",
  description: "Reconnaissance lente via répétition de path-traversal",
  severity: "low",
  score: 2,

  detect(events) {
    const pts = events.filter((e) => vulnOf(e) === "path-traversal");
    return pts.length >= 3;
  },
};

export const dnsExfiltrationPattern: AdvancedPattern = {
  id: "dns-exfiltration-progressive",
  description: "Exfiltration DNS progressive",
  severity: "medium",
  score: 3,

  detect(events) {
    const dns = events.filter((e) => vulnOf(e) === "dns");
    return dns.length >= 5;
  },
};

export const advancedPivotPattern: AdvancedPattern = {
  id: "advanced-pivot",
  description: "Pivot avancé entre ssrf, dns et rce",
  severity: "high",
  score: 4,

  detect(events) {
    const vulns = new Set(events.map(vulnOf));
    return vulns.has("ssrf") && vulns.has("dns") && vulns.has("rce");
  },
};

export const privilegeEscalationPattern: AdvancedPattern = {
  id: "privilege-escalation",
  description: "Escalade de privilèges via séquence auth/admin/config",
  severity: "critical",
  score: 5,

  detect(events) {
    const vulns = new Set(events.map(vulnOf));
    return (
      vulns.has("auth-success") &&
      vulns.has("admin-action") &&
      vulns.has("config-change")
    );
  },
};

/**
 * ─────────────────────────────────────────────────────────────
 *  TES PATTERNS MULTI‑ÉVÉNEMENTS
 * ─────────────────────────────────────────────────────────────
 */

export const scanExploitPattern: AdvancedPattern = {
  id: "scan-exploit-sequence",
  description: "Scan suivi d’un exploit dans une fenêtre courte",
  severity: "high",
  score: 4,

  detect(events) {
    const scans = events.filter((e) => vulnOf(e) === "scan");
    const exploits = events.filter(
      (e) => vulnOf(e) === "rce" || vulnOf(e) === "sqli",
    );

    for (const scan of scans) {
      for (const exploit of exploits) {
        if (exploit.timestamp - scan.timestamp <= 5000) {
          return true;
        }
      }
    }
    return false;
  },
};

export const dnsHttpPattern: AdvancedPattern = {
  id: "dns-http-correlation",
  description: "DNS + HTTP dans une fenêtre de 10 secondes",
  severity: "critical",
  score: 5,

  detect(events) {
    const dns = events.filter((e) => vulnOf(e) === "dns");
    const http = events.filter((e) => vulnOf(e) === "http");

    for (const d of dns) {
      for (const h of http) {
        if (Math.abs(h.timestamp - d.timestamp) <= 10000) {
          return true;
        }
      }
    }
    return false;
  },
};

export const burstPattern: AdvancedPattern = {
  id: "burst-activity",
  description: "Burst d’événements dans une fenêtre très courte",
  severity: "medium",
  score: 3,

  detect(events) {
    const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 0; i < sorted.length - 10; i++) {
      const start = sorted[i].timestamp;
      const end = sorted[i + 10].timestamp;

      if (end - start <= 3000) {
        return true;
      }
    }
    return false;
  },
};

export const persistencePattern: AdvancedPattern = {
  id: "persistent-activity",
  description: "Activité persistante sur une longue fenêtre",
  severity: "low",
  score: 2,

  detect(events) {
    if (events.length < 5) return false;

    const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
    const first = sorted[0].timestamp;
    const last = sorted[sorted.length - 1].timestamp;

    return last - first >= 120000; // 2 minutes
  },
};

/**
 * ─────────────────────────────────────────────────────────────
 *  EXPORT FINAL
 * ─────────────────────────────────────────────────────────────
 */

export const advancedPatterns: AdvancedPattern[] = [
  slowReconnaissancePattern,
  dnsExfiltrationPattern,
  advancedPivotPattern,
  privilegeEscalationPattern,

  scanExploitPattern,
  dnsHttpPattern,
  burstPattern,
  persistencePattern,
];
