export const killChainStages = [
  "recon",
  "delivery",
  "exploit",
  "lateral",
  "privilege",
  "impact",
] as const;

export type KillChainStage = (typeof killChainStages)[number];
