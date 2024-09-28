"use client";

import { useState } from "react";
import { Box, Volume2, Database, BarChart2, Sparkle } from "lucide-react";

const navItems = [
  { icon: Box, label: "3D" },
  { icon: Volume2, label: "Audio" },
  { icon: Sparkle, label: "AI Chat" },
  { icon: Database, label: "Data" },
  { icon: BarChart2, label: "Analytics" },
];

export default function NeonNavigation() {
  const [selected, setSelected] = useState("AI Chat");

  return (
    <nav className="bg-gray-900 p-4 rounded-full flex items-center justify-center space-x-4">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => setSelected(item.label)}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            selected === item.label
              ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-110"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <div className="flex items-center">
            {item.icon ? (
              <item.icon className="w-6 h-6 mr-2" />
            ) : (
              <span className="text-sm font-medium">{item.label}</span>
            )}
            {item.label === "AI Chat" && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </div>
          <span className="sr-only">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
