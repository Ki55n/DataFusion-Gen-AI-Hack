import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon, Edit, MoreVertical, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileItem {
  file_uuid: string;
  name: string;
  description: string;
  size: string;
  dateUploaded: Date;
}

interface FileListProps {
  files: FileItem[];
  onFilesSelect: (ids: string[]) => void;
  onCleanData: (id: string) => void;
  onAnalyzeData: (id: string) => void;
}

export function FileList({
  files,
  onFilesSelect,
  onCleanData,
  onAnalyzeData,
}: FileListProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleFileSelect = (id: string, isChecked: boolean) => {
    setSelectedFiles((prev) =>
      isChecked ? [...prev, id] : prev.filter((fileId) => fileId !== id)
    );
    onFilesSelect(
      isChecked
        ? [...selectedFiles, id]
        : selectedFiles.filter((fileId) => fileId !== id)
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    const allFileIds = isChecked ? files.map((file) => file.file_uuid) : [];
    setSelectedFiles(allFileIds);
    onFilesSelect(allFileIds);
  };

  const addNewFile = () => {
    // Implementation for adding a new file
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <Button onClick={addNewFile} className="bg-blue-600 hover:bg-blue-700">
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between text-sm font-medium text-gray-400">
          <span className="w-1/12">
            <Checkbox
              checked={selectedFiles.length === files.length}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
          </span>
          <span className="w-2/5">Name</span>
          <span className="w-1/5 text-right">Size</span>
          <span className="w-1/5 text-right">Upload Date</span>
          <span className="w-1/12"></span>
        </div>
        <ScrollArea className="h-[calc(100vh-250px)]">
          {files.map((file) => (
            <div
              key={file.file_uuid}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors duration-150"
            >
              <div className="w-1/12">
                <Checkbox
                  checked={selectedFiles.includes(file.file_uuid)}
                  onCheckedChange={(checked) =>
                    handleFileSelect(file.file_uuid, checked as boolean)
                  }
                />
              </div>
              <div className="flex items-center w-2/5">
                <FileIcon className="mr-3 h-5 w-5 text-blue-400" />
                <span className="font-medium">{file.name}</span>
              </div>
              <span className="w-1/5 text-right text-gray-400">
                {file.size}
              </span>
              <span className="w-1/5 text-right text-gray-400">
                {file.dateUploaded.toString()}
              </span>
              <div className="w-1/12 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-800 text-gray-100 border border-gray-700">
                    <DropdownMenuItem
                      onSelect={() => onCleanData(file.file_uuid)}
                      className="hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Clean Data
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => onAnalyzeData(file.file_uuid)}
                      className="hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Analyze Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  );
}
