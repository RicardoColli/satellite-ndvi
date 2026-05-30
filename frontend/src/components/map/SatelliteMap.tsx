"use client";

import { useState } from "react";
import area from "@turf/area";

import {
  FeatureGroup,
  ImageOverlay,
  MapContainer,
  TileLayer,
} from "react-leaflet";

import { EditControl } from "react-leaflet-draw";

import { api } from "../../services/api";

export default function SatelliteMap() {
  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [bounds, setBounds] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [mapType, setMapType] =
    useState<"map" | "satellite">(
      "satellite"
    );

  const [areaHa, setAreaHa] =
    useState<number | null>(null);

  const [ndviMean, setNdviMean] =
    useState<number | null>(null);

  const [ndviMin, setNdviMin] =
    useState<number | null>(null);

  const [ndviMax, setNdviMax] =
    useState<number | null>(null);

  const [imageDate, setImageDate] =
    useState<string | null>(null);

  const handleCreated = async (
    e: any
  ) => {
    const layer = e.layer;

    const geojson =
      layer.toGeoJSON();

    setLoading(true);

    // limpa análise anterior
    setImageUrl(null);
    setBounds(null);

    setNdviMean(null);
    setNdviMin(null);
    setNdviMax(null);
    setImageDate(null);

    const areaMeters =
      area(geojson);

    const hectares =
      areaMeters / 10000;

    setAreaHa(hectares);

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

    const southWest = [
      Math.min(...latitudes),
      Math.min(...longitudes),
    ];

    const northEast = [
      Math.max(...latitudes),
      Math.max(...longitudes),
    ];

    try {
      const response =
        await api.post(
          "/satellite/area",
          {
            area: geojson,
          }
        );

      const url =
        `data:image/png;base64,${response.data.image}`;

      setImageUrl(url);

      setBounds([
        southWest,
        northEast,
      ]);

      setNdviMean(
        response.data.ndviMean
      );

      setNdviMin(
        response.data.ndviMin
      );

      setNdviMax(
        response.data.ndviMax
      );

      setImageDate(
        response.data.imageDate
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as const,
  };

  return (
    <>
      {/* Botões */}
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          top: 10,
          left: 60,
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          style={{
            ...buttonStyle,
            background:
              mapType === "map"
                ? "#2563eb"
                : "white",

            color:
              mapType === "map"
                ? "white"
                : "black",
          }}
          onClick={() =>
            setMapType("map")
          }
        >
          🗺️ Mapa
        </button>

        <button
          style={{
            ...buttonStyle,
            background:
              mapType === "satellite"
                ? "#2563eb"
                : "white",

            color:
              mapType === "satellite"
                ? "white"
                : "black",
          }}
          onClick={() =>
            setMapType(
              "satellite"
            )
          }
        >
          🛰️ Satélite
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div
          style={{
            position:
              "absolute",
            top: 70,
            right: 20,
            zIndex: 2000,
            background:
              "#2563eb",
            color: "white",
            padding:
              "12px 18px",
            borderRadius: "8px",
            fontWeight:
              "bold",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          🛰️ Processando imagem Sentinel...
        </div>
      )}

      {/* Painel */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 10,
          zIndex: 1000,
          width: "260px",
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)",
          fontFamily: "Arial",
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          🌱 Análise NDVI
        </h3>

        <hr />

        <p>
          <strong>Área:</strong>{" "}
          {areaHa !== null
            ? `${areaHa.toFixed(2)} ha`
            : "--"}
        </p>

        <p>
          <strong>NDVI Médio:</strong>{" "}
          {ndviMean !== null
            ? ndviMean.toFixed(2)
            : "--"}
        </p>

        <p>
          <strong>NDVI Mín:</strong>{" "}
          {ndviMin !== null
            ? ndviMin.toFixed(2)
            : "--"}
        </p>

        <p>
          <strong>NDVI Máx:</strong>{" "}
          {ndviMax !== null
            ? ndviMax.toFixed(2)
            : "--"}
        </p>

        <p>
          <strong>Data:</strong>{" "}
          {imageDate ?? "--"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {ndviMean === null
            ? "--"
            : ndviMean > 0.6
            ? "🟢 Saudável"
            : ndviMean > 0.4
            ? "🟡 Médio"
            : "🔴 Crítico"}
        </p>

        <hr />

        <h4>Legenda</h4>

        <div>🟫 Solo</div>
        <div>🟥 Muito baixo</div>
        <div>🟧 Baixo</div>
        <div>🟨 Médio</div>
        <div>🟩 Bom</div>
        <div>🟢 Excelente</div>
      </div>

      <MapContainer
        center={[
          -28.8836,
          -52.5478,
        ]}
        zoom={13}
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        {mapType === "map" ? (
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution="© Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {imageUrl &&
          bounds && (
            <ImageOverlay
              url={imageUrl}
              bounds={bounds}
              opacity={0.8}
            />
          )}

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={
              handleCreated
            }
            draw={{
              rectangle: true,
              polygon: true,

              circle: false,
              circlemarker:
                false,
              marker: false,
              polyline: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </>
  );
}