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

    try {

      const stats =
        await getNDVIStats(area);

      console.log(
        "NDVI Stats:"
      );

      console.log(
        JSON.stringify(
          stats,
          null,
          2
        )
      );

    } catch (statsError: any) {

      console.log(
        "Erro ao obter estatísticas:"
      );

      console.log(
        statsError?.response?.data?.toString?.() ||
        statsError
      );
    }

    return res.json(image);

  } catch (error: any) {

    console.log(
      "Erro principal:"
    );

    console.log(
      error?.response?.data?.toString?.() ||
      error
    );

    return res.status(500).json({
      error:
        "Erro ao gerar NDVI",
    });
  }
});

export default router;