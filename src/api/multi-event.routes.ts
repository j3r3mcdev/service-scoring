import { Router } from "express";
import { MultiEventController } from "./multi-event.controller";

const router = Router();
const controller = new MultiEventController();

router.post("/scoring/batch", (req, res) => controller.handleBatch(req, res));

export default router;
