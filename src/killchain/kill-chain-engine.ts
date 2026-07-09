import { CorrelationFinding } from "../correlation/correlation-types";
import { KillChainMapper } from "./kill-chain-mapper";
import { KillChainStage } from "./kill-chain-stages";

export interface KillChainStep {
  stage: KillChainStage;
  finding: CorrelationFinding;
}

export class KillChainEngine {
  private mapper = new KillChainMapper();

  run(findings: CorrelationFinding[]): KillChainStep[] {
    const steps: KillChainStep[] = [];

    for (const f of findings) {
      const stage = this.mapper.map(f);
      if (stage) {
        steps.push({ stage, finding: f });
      }
    }

    // tri dans l’ordre de la kill chain
    const order: KillChainStage[] = [
      "recon",
      "delivery",
      "exploit",
      "lateral",
      "privilege",
      "impact",
    ];

    return steps.sort(
      (a, b) => order.indexOf(a.stage) - order.indexOf(b.stage),
    );
  }
}
