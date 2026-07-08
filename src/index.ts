import express from "express";
import multiEventRoutes from "./api/multi-event.routes";

const app = express();
app.use(express.json());

// Ajout de la route multi‑événements
app.use("/api", multiEventRoutes);

export default app;
