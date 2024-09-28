import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface SidebarProps {
  title: string;
  actions: string[];
  onClose: () => void;
  onActionClick: (action: string) => void;
  fileId: string;
}

export function Sidebar({
  title,
  actions,
  onClose,
  onActionClick,
  fileId,
}: SidebarProps) {
  return (
    <div className="w-1/4 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="p-4 flex justify-between items-center bg-transparent">
        <h2 className="text-3xl font-bold" style={{ color: "#0ff" }}>
          {title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="px-4 py-2 bg-gray-800">
        <span className="text-sm text-gray-400">File ID: {fileId}</span>
      </div>
      <ScrollArea className="flex-grow p-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={() => onActionClick(action)}
            className="w-full mb-2 bg-gray-800 hover:bg-gray-700 text-left justify-start"
          >
            {action}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
