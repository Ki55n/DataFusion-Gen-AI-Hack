"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, Trash2Icon, UploadIcon } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

export default function Component({ params }: { params: { id: string } }) {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "document.pdf", size: "2.5 MB", uploadDate: "2023-05-15" },
    { id: "2", name: "image.jpg", size: "1.8 MB", uploadDate: "2023-05-14" },
    {
      id: "3",
      name: "spreadsheet.xlsx",
      size: "3.2 MB",
      uploadDate: "2023-05-13",
    },
    {
      id: "4",
      name: "presentation.pptx",
      size: "5.7 MB",
      uploadDate: "2023-05-12",
    },
    { id: "5", name: "code.js", size: "0.5 MB", uploadDate: "2023-05-11" },
  ]);

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const addNewFile = () => {
    // This is a mock function. In a real application, you'd handle file upload here.
    const newFile: FileItem = {
      id: String(files.length + 1),
      name: `newfile${files.length + 1}.txt`,
      size: "1.0 MB",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setFiles([newFile, ...files]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="px-6 py-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Project: {params.id} Dashboard</h1>
      </header>
      <main className="flex-grow p-6 overflow-hidden">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Uploaded Files</h2>
          <Button
            onClick={addNewFile}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Add New File
          </Button>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between text-sm font-medium text-gray-400">
            <span className="w-2/5">Name</span>
            <span className="w-1/5 text-right">Size</span>
            <span className="w-1/5 text-right">Upload Date</span>
            <span className="w-1/5"></span>
          </div>
          <ScrollArea className="h-[calc(100vh-250px)]">
            {files.map((file) => (
              <div
                key={file.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors duration-150"
              >
                <div className="flex items-center w-2/5">
                  <FileIcon className="mr-3 h-5 w-5 text-blue-400" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <span className="w-1/5 text-right text-gray-400">
                  {file.size}
                </span>
                <span className="w-1/5 text-right text-gray-400">
                  {file.uploadDate}
                </span>
                <div className="w-1/5 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                  >
                    <Trash2Icon className="h-5 w-5" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}
