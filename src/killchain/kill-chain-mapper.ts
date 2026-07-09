import { CorrelationFinding } from "../correlation/engine/pipeline/correlation-types";
import { KillChainStage } from "./kill-chain-stages";

export class KillChainMapper {
  map(finding: CorrelationFinding): KillChainStage | null {
    const id = finding.id;

    if (id.includes("path") || id.includes("dns") || id.includes("xss"))
      return "recon";

    if (id.includes("sqli") || id.includes("ssrf") || id.includes("waf"))
      return "delivery";

    if (id.includes("rce") || id.includes("lfi")) return "exploit";

    if (id.includes("multi-ip") || id.includes("lateral-pivot"))
      return "lateral";

    if (
      id.includes("api") ||
      id.includes("service") ||
      id.includes("escalation")
    )
      return "privilege";

    if (id.includes("impact") || id.includes("exfil")) return "impact";

    return null;
  }
}
