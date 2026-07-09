import express from "express";
import scoringRoutes from "./api/scoring.controller";
import multiEventRoutes from "./api/multi-event.routes";

const app = express();
app.use(express.json());

app.use("/scoring", scoringRoutes);
app.use("/scoring", multiEventRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
  console.log(`Service scoring running on port ${PORT}`);
});
