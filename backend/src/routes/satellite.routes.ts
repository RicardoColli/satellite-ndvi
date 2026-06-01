import { Router } from "express";

import {
  saveAnalysis,
} from "../../services/analysis.service";

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
      stats?.data?.[0]
        ?.outputs?.default
        ?.bands?.B0?.stats;

    const ndviMean =
      bandStats?.mean ?? null;

    const ndviMin =
      bandStats?.min ?? null;

    const ndviMax =
      bandStats?.max ?? null;

    const imageDate =
      stats?.data?.[0]
        ?.interval?.from
        ?.split("T")[0] ??
      new Date()
        .toISOString()
        .split("T")[0];

    await saveAnalysis({
      area_ha:
        image.areaHa,

      ndvi_mean:
        ndviMean,

      ndvi_min:
        ndviMin,

      ndvi_max:
        ndviMax,

      image_date:
        imageDate,

      geometry:
        area.geometry,
    });

    return res.json({
      image:
        image.image,

      areaHa:
        image.areaHa,

      ndviMean,
      ndviMin,
      ndviMax,

      imageDate,
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
        "Erro ao gerar NDVI",
    });
  }
});

export default router;