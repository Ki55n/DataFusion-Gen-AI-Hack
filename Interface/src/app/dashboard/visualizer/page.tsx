"use client";

import React, { useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Button } from "@/components/ui/button";
import LineGraph from "@/components/visualization/LineGraph";
import PieChart from "@/components/visualization/PieChart";
import BarChart from "@/components/visualization/BarChart";
import { GlobeDemo } from "@/components/visualization/Globe";
import GlobeComponent from "@/components/visualization/vGlobe";

const ResponsiveGridLayout = WidthProvider(Responsive);

type Layouts = {
  [key: string]: Layout[];
};

export default function Dashboard() {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: [
      { i: "bar", x: 0, y: 0, w: 6, h: 2.5 },
      { i: "pie", x: 6, y: 0, w: 6, h: 2.5 },
      { i: "line", x: 0, y: 2, w: 6, h: 2.5 },
      { i: "globe", x: 6, y: 2, w: 6, h: 2.5 },
    ],
  });

  const [data, setData] = useState({
    bar: [
      { label: "A", value: 10 },
      { label: "B", value: 20 },
      { label: "C", value: 30 },
    ],
    pie: [
      { label: "X", value: 30 },
      { label: "Y", value: 40 },
      { label: "Z", value: 30 },
    ],
    line: [
      { date: "2023-01-01", value: 100 },
      { date: "2023-02-01", value: 150 },
      { date: "2023-03-01", value: 200 },
      { date: "2023-04-01", value: 180 },
      { date: "2023-05-01", value: 220 },
    ],
    globe: [
      { lat: 40.7128, lng: -74.006, city: "New York" },
      { lat: 51.5074, lng: -0.1278, city: "London" },
      { lat: 35.6762, lng: 139.6503, city: "Tokyo" },
    ],
  });

  const generateVisualization = () => {
    setData({
      bar: [
        { label: "A", value: Math.random() * 50 },
        { label: "B", value: Math.random() * 50 },
        { label: "C", value: Math.random() * 50 },
      ],
      pie: [
        { label: "X", value: Math.random() * 100 },
        { label: "Y", value: Math.random() * 100 },
        { label: "Z", value: Math.random() * 100 },
      ],
      line: [
        { date: "2023-01-01", value: Math.random() * 300 },
        { date: "2023-02-01", value: Math.random() * 300 },
        { date: "2023-03-01", value: Math.random() * 300 },
        { date: "2023-04-01", value: Math.random() * 300 },
        { date: "2023-05-01", value: Math.random() * 300 },
      ],
      globe: data.globe,
    });
  };

  return (
    <div className="p-4">
      <Button onClick={generateVisualization} className="mb-4">
        Generate Visualization
      </Button>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        onLayoutChange={(currentLayout, allLayouts) => setLayouts(allLayouts)}
      >
        <div key="bar" className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Bar Chart</h2>
          <BarChart data={data.bar} />
        </div>
        <div key="pie" className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Pie Chart</h2>
          <PieChart data={data.pie} />
        </div>
        <div key="line" className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Line Graph</h2>
          <LineGraph data={data.line} />
        </div>
        {/* <div key="globe" className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Interactive Globe</h2>
          <GlobeDemo />
        </div> */}
        <div
          key="globe"
          className="bg-gray-800 p-4 rounded shadow overflow-hidden"
        >
          <h2 className="text-lg font-bold mb-2 ">Interactive Globe</h2>
          <div className="flex justify-center items-center">
            <GlobeComponent data={data.globe} />
          </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
