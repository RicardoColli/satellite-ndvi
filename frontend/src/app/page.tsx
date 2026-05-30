"use client";

import dynamic from "next/dynamic";

const SatelliteMap = dynamic(
  () => import("../components/map/SatelliteMap"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main>
      <SatelliteMap />
    </main>
  );
}