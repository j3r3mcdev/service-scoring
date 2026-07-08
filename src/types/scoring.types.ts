export type Vulnerability =
  | "ssrf"
  | "xss"
  | "sqli"
  | "dns"
  | "http"
  | "waf"
  | "rce"
  | "lfi"
  | "path_traversal";

export type Severity = "low" | "medium" | "high" | "critical";

export type EventSource = "http" | "dns" | "waf" | "scan" | "oast";

export interface NormalizedEvent {
  id: string;
  source: EventSource;
  protocol?: string;
  timestamp: number;
  payload?: string;
  metadata: Record<string, any>;
}

export interface CorrelationChain {
  id: string;
  type: Vulnerability;
  events: NormalizedEvent[];
  confidence: number;
}

export interface Finding {
  id: string;
  vulnerability: Vulnerability;
  severity: Severity;
  score: number;
  evidence: NormalizedEvent[];
  chains?: CorrelationChain[];
  details?: string;
}

export interface ScoringContext {
  events: NormalizedEvent[];
  chains: CorrelationChain[];
  metadata?: Record<string, any>;
}

export interface ScoringResult {
  score: number;
  severity: Severity;
  findings: Finding[];
  chains: CorrelationChain[];
  timestamp: number;
  metadata?: Record<string, any>;
}
