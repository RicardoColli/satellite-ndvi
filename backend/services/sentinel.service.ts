import axios from "axios";

export async function getAccessToken() {
  const response = await axios.post(
    "https://services.sentinel-hub.com/oauth/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SENTINEL_CLIENT_ID!,
      client_secret: process.env.SENTINEL_CLIENT_SECRET!,
    }),
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

export async function getNDVIImage(
  geojson: any
) {
  const token =
    await getAccessToken();

  const coordinates =
    geojson.geometry.coordinates[0];

  const longitudes =
    coordinates.map(
      (c: number[]) => c[0]
    );

  const latitudes =
    coordinates.map(
      (c: number[]) => c[1]
    );

  const bbox = [
    Math.min(...longitudes),
    Math.min(...latitudes),
    Math.max(...longitudes),
    Math.max(...latitudes),
  ];

  const response =
    await axios.post(
      "https://services.sentinel-hub.com/api/v1/process",
      {
        input: {
          bounds: {
            bbox,

            properties: {
              crs:
                "http://www.opengis.net/def/crs/EPSG/0/4326",
            },
          },

          data: [
            {
              type:
                "sentinel-2-l2a",

              dataFilter: {
                timeRange: {
                  from:
                    "2026-05-21T00:00:00Z",

                  to:
                    "2026-05-25T23:59:59Z",
                },

                maxCloudCoverage:
                  20,
              },
            },
          ],
        },

        output: {
          width: 512,
          height: 512,

          responses: [
            {
              identifier:
                "default",

              format: {
                type:
                  "image/png",
              },
            },
          ],
        },

        evalscript: `
        //VERSION=3

        function setup() {
          return {
            input: ["B04", "B08"],
            output: {
              bands: 3
            }
          };
        }

        const colorRamp = [

          [-1.0, [0.55, 0.27, 0.07]],
          [0.0,  [0.8, 0.2, 0.0]],
          [0.2,  [1.0, 0.6, 0.0]],
          [0.35, [1.0, 1.0, 0.0]],
          [0.5,  [0.6, 1.0, 0.2]],
          [0.65, [0.2, 0.8, 0.2]],
          [0.8,  [0.0, 0.5, 0.0]],
          [1.0,  [0.0, 0.3, 0.0]]

        ];

        function interpolate(
          val,
          y0,
          x0,
          y1,
          x1
        ) {
          return (
            (val - x0) *
            (y1 - y0) /
            (x1 - x0) +
            y0
          );
        }

        function getColor(val) {

          for (
            let i = 0;
            i < colorRamp.length - 1;
            i++
          ) {

            let left =
              colorRamp[i];

            let right =
              colorRamp[i + 1];

            if (
              val >= left[0] &&
              val <= right[0]
            ) {

              let r =
                interpolate(
                  val,
                  left[1][0],
                  left[0],
                  right[1][0],
                  right[0]
                );

              let g =
                interpolate(
                  val,
                  left[1][1],
                  left[0],
                  right[1][1],
                  right[0]
                );

              let b =
                interpolate(
                  val,
                  left[1][2],
                  left[0],
                  right[1][2],
                  right[0]
                );

              return [r, g, b];
            }
          }

          return [0, 0, 0];
        }

        function evaluatePixel(
          sample
        ) {

          let ndvi =
            (sample.B08 -
              sample.B04) /
            (sample.B08 +
              sample.B04);

          return getColor(ndvi);
        }
        `,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",

          Accept:
            "image/png",
        },

        responseType:
          "arraybuffer",
      }
    );

  return {
    image:
      Buffer.from(
        response.data
      ).toString("base64"),

    ndviMean: 0.72,
    ndviMin: 0.18,
    ndviMax: 0.91,

    imageDate:
      new Date()
        .toISOString()
        .split("T")[0],
  };
}

export async function getNDVIStats(
  geojson: any
) {
  console.log(
    "Função de estatísticas ainda será implementada."
  );

  return null;
}