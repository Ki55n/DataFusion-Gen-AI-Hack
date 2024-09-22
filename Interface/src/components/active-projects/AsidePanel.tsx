import React from "react";
import { Button } from "@/components/ui/button";
import { X, Wand2, Sparkles, BarChart2, Download } from "lucide-react";

type AsidePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedProjectId: string | null;
};

export default function AsidePanel({
  isOpen,
  onClose,
  selectedProjectId,
}: AsidePanelProps) {
  const handleOperation = (operation: string) => {
    if (selectedProjectId) {
      console.log(`${operation} for project with id: ${selectedProjectId}`);
    }
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-full w-64 bg-gray-800 text-gray-100 p-4 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Operations</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-300 hover:text-gray-100"
          aria-label="Close operations panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOperation("AI Features")}
          className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600 text-gray-100"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          AI Features
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOperation("Clean Data")}
          className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600 text-gray-100"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Clean Data
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOperation("Analyze")}
          className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600 text-gray-100"
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Analyze
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOperation("Export")}
          className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600 text-gray-100"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </aside>
  );
}
