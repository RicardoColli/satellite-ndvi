import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";

import satelliteRoutes from "./routes/satellite.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/satellite", satelliteRoutes);

app.get("/", (req, res) => {
  res.send("NDVI API running");
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});