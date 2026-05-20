"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: () => <div style={{ height: "500px", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>Loading interactive map...</div> });

const MapComponent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: "500px" }} />;

  const locations = [
    { name: "Haiti", lat: 18.5392, lon: -72.3350, size: 40, text: "Haiti - The Heart of the Language" },
    { name: "Miami Metro", lat: 25.7617, lon: -80.1918, size: 25, text: "Miami Metro - High concentration diaspora" },
    { name: "NYC / NJ", lat: 40.7128, lon: -74.0060, size: 30, text: "NYC & NJ - Major cultural hub" },
    { name: "Boston", lat: 42.3601, lon: -71.0589, size: 20, text: "Boston - Significant community presence" },
    { name: "Philadelphia", lat: 39.9526, lon: -75.1652, size: 15, text: "Philadelphia - Growing population" },
    { name: "Montreal, QC", lat: 45.5017, lon: -73.5673, size: 25, text: "Montreal - Largest community in Canada" },
    { name: "Havana, Cuba", lat: 23.1136, lon: -82.3666, size: 18, text: "Havana - Historical migration hub" },
    { name: "Dominican Republic", lat: 18.4861, lon: -69.9312, size: 30, text: "DR - Direct neighbor, large workforce" },
    { name: "Chile", lat: -33.4489, lon: -70.6693, size: 20, text: "Chile - Rapidly growing diaspora destination" },
  ];

  const data = [
    {
      type: "scattergeo",
      mode: "markers",
      lat: locations.map(loc => loc.lat),
      lon: locations.map(loc => loc.lon),
      text: locations.map(loc => loc.text),
      marker: {
        size: locations.map(loc => loc.size),
        color: "#a855f7",
        line: {
          color: "rgba(255, 255, 255, 0.5)",
          width: 2,
        },
        opacity: 0.8,
      },
      hoverinfo: "text",
    },
  ];

  const layout = {
    font: { family: "Inter, sans-serif" },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    margin: { t: 0, r: 0, b: 0, l: 0 },
    geo: {
      scope: "world",
      resolution: 50,
      showland: true,
      landcolor: "#1e1e2d",
      showocean: true,
      oceancolor: "#06060c",
      showcountries: true,
      countrycolor: "#33334d",
      bgcolor: "transparent",
      center: { lat: 25, lon: -75 },
      projection: {
        type: "orthographic",
        rotation: { lon: -75, lat: 25, roll: 0 },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "500px", borderRadius: "24px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
      {/* @ts-ignore */}
      <Plot data={data} layout={layout} useResizeHandler={true} style={{ width: "100%", height: "100%" }} config={{ displayModeBar: false, responsive: true }} />
    </div>
  );
};

export default MapComponent;
