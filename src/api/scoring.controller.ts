import { Router } from "express";
import { ScoringController } from "../controller/scoring";

const router = Router();

router.post("/score", (req, res) => {
  const rawIp = req.ip ?? req.headers["x-forwarded-for"] ?? "unknown";
  const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp;

  const events = req.body?.events ?? [];
  const result = ScoringController.scoreWithAlerts(ip, events);

  res.json(result);
});

export default router;
