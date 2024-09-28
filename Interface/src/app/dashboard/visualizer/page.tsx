"use client";

import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Button } from "@/components/ui/button";
import LineGraph from "@/components/visualization/LineGraph";
import PieChart from "@/components/visualization/PieChart";
import BarChart from "@/components/visualization/BarChart";
import GlobeComponent from "@/components/visualization/vGlobe";
import {
  getVisualizations,
  updateVisualizationLayout,
  Visualization,
} from "@/db/visualizer";
import { Volume2, Square } from "lucide-react";

const ResponsiveGridLayout = WidthProvider(Responsive);

type Layouts = {
  [key: string]: Layout[];
};

export default function Dashboard() {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: [],
  });
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isResizable, setIsResizable] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisualizations = async () => {
      const userId = "user123"; // Replace with actual user ID, e.g., from authentication
      const fetchedVisualizations = await getVisualizations(userId);
      setVisualizations(fetchedVisualizations);

      // Create layouts based on fetched visualizations
      const newLayouts: Layout[] = fetchedVisualizations.map((viz) => ({
        i: viz._id,
        x: viz.layout.x,
        y: viz.layout.y,
        w: viz.layout.w,
        h: viz.layout.h,
      }));
      setLayouts({ lg: newLayouts });
    };

    fetchVisualizations();
  }, []);

  const renderVisualization = (visualization: Visualization) => {
    switch (visualization.visualizationType) {
      case "bar":
        return <BarChart data={visualization.data} />;
      case "pie":
        return <PieChart data={visualization.data} />;
      case "line":
        return <LineGraph data={visualization.data} />;
      case "globe":
        return <GlobeComponent />;
      default:
        return <div>Unsupported visualization type</div>;
    }
  };

  const handleEditLayout = () => {
    setIsEditing(true);
    setIsDraggable(true);
    setIsResizable(true);
  };

  const handleSaveLayout = async () => {
    setIsEditing(false);
    setIsDraggable(false);
    setIsResizable(false);

    const updates = layouts.lg.map((layout) => ({
      _id: layout.i,
      layout: {
        x: layout.x,
        y: layout.y,
        w: layout.w,
        h: layout.h,
      },
    }));

    const success = await updateVisualizationLayout(updates);
    if (success) {
      console.log("Layout updated successfully");
    } else {
      console.error("Failed to update layout");
    }
  };

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  const speakChartData = (id: string, description: string) => {
    if ("speechSynthesis" in window) {
      if (speakingId === id) {
        // If the same chart is speaking, stop it
        speechSynthesis.cancel();
        setSpeakingId(null);
      } else {
        // If a different chart is speaking, stop the previous one and start the new one
        speechSynthesis.cancel();
        setSpeakingId(id);

        const utterance = new SpeechSynthesisUtterance(description);
        utterance.rate = 0.7; // Slow down the voice tempo

        // Get the list of voices and select the one that contains 'Zira' in the name
        const voices = speechSynthesis.getVoices();
        const ziraVoice =
          voices.find((voice) => voice.name.includes("Zira")) || voices[0]; // Fallback to the first available voice

        if (ziraVoice) {
          utterance.voice = ziraVoice;
        }

        utterance.onend = () => setSpeakingId(null);
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {isEditing ? (
          <Button onClick={handleSaveLayout}>Save Layout</Button>
        ) : (
          <Button onClick={handleEditLayout}>Edit Layout</Button>
        )}
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        onLayoutChange={handleLayoutChange}
        isDraggable={isDraggable}
        isResizable={isResizable}
      >
        {visualizations.map((visualization) => (
          <div
            key={visualization._id}
            className="bg-gray-800 p-4 rounded shadow"
          >
            <h2 className="text-lg font-bold mb-2">{visualization.fileName}</h2>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-gray-900"
              onClick={() =>
                speakChartData(visualization._id, visualization.description)
              }
            >
              {speakingId === visualization._id ? (
                <Square className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="sr-only">
                {speakingId === visualization._id
                  ? "Stop speaking"
                  : "Speak chart data"}
              </span>
            </Button>
            {renderVisualization(visualization)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
