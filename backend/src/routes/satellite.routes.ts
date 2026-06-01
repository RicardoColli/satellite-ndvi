import { Router } from "express";

import {
  getNDVIImage,
  getNDVIStats,
} from "../../services/sentinel.service";

const router = Router();

router.post("/area", async (req, res) => {
  try {
    const { area } = req.body;

    const image =
      await getNDVIImage(area);

    const stats =
      await getNDVIStats(area);

    console.log(
      "===== STATS ====="
    );

    console.log(
  JSON.stringify(
    stats,
    null,
    2
  )
);

    const bandStats =
        stats?.data?.[0]?.outputs?.default?.bands?.B0?.stats;

      return res.json({
        ...image,

        ndviMean:
          bandStats?.mean ?? null,

        ndviMin:
          bandStats?.min ?? null,

        ndviMax:
          bandStats?.max ?? null,
      });

  } catch (error: any) {

    console.log(
      "ROUTE ERROR:"
    );

    console.log(
      error?.response?.data ||
      error.message
    );

    return res.status(500).json({
      error:
        "Erro ao gerar NDVI"
    });
  }
});

export default router;