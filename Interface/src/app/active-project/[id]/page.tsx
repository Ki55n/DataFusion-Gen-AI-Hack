"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, Sparkles, UploadIcon, X } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
}

interface ComponentProps {
  params?: { id?: string };
}

export default function Component({ params }: ComponentProps) {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "5976d09b-c5d2-408e-9ff8-8dfbe189d649",
      name: "document.pdf",
      size: "2.5 MB",
      uploadDate: "2023-05-15",
    },
    {
      id: "5337c052-db72-5fea-9e4d-1c79ce2cd52",
      name: "image.jpg",
      size: "1.8 MB",
      uploadDate: "2023-05-14",
    },
    {
      id: "6448d163-ec83-6gfb-0f5e-2d80df3de63",
      name: "spreadsheet.xlsx",
      size: "3.2 MB",
      uploadDate: "2023-05-13",
    },
    {
      id: "7559e274-fd94-7hgc-1g6f-3e91eg4ef74",
      name: "presentation.pptx",
      size: "5.7 MB",
      uploadDate: "2023-05-12",
    },
    {
      id: "8660f385-ge05-8ihd-2h7g-4fa2fh5fg85",
      name: "code.js",
      size: "0.5 MB",
      uploadDate: "2023-05-11",
    },
  ]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const aiChat = (id: string) => {
    setSelectedFileId(id);
    if (!chatMessages[id]) {
      setChatMessages((prev) => ({ ...prev, [id]: [] }));
    }
  };

  const addNewFile = () => {
    const newFile: FileItem = {
      id: `new-${Date.now()}`,
      name: `newfile${files.length + 1}.txt`,
      size: "1.0 MB",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setFiles([newFile, ...files]);
  };

  const sendMessage = async () => {
    if (currentMessage.trim() && selectedFileId) {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        content: currentMessage,
      };
      setChatMessages((prev) => ({
        ...prev,
        [selectedFileId]: [...(prev[selectedFileId] || []), newUserMessage],
      }));
      setCurrentMessage("");
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8001/call-model", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_uuid: selectedFileId,
            query: currentMessage,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: data.answer || "Sorry, I couldn't process that request.",
        };
        setChatMessages((prev) => ({
          ...prev,
          [selectedFileId]: [...(prev[selectedFileId] || []), aiResponse],
        }));
      } catch (error) {
        console.error("Error:", error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: "Sorry, there was an error processing your request.",
        };
        setChatMessages((prev) => ({
          ...prev,
          [selectedFileId]: [...(prev[selectedFileId] || []), errorMessage],
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow flex flex-col">
        <header className="px-6 py-4 bg-gray-800">
          <h1 className="text-2xl font-bold">
            Project: {params?.id || "Unknown"} Dashboard
          </h1>
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
                  className={`px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors duration-150 ${
                    selectedFileId === file.id ? "bg-gray-700" : ""
                  }`}
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
                      onClick={() => aiChat(file.id)}
                      className={`text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/20 ${
                        selectedFileId === file.id ? "bg-cyan-400/20" : ""
                      }`}
                    >
                      <Sparkles className="h-5 w-5" />
                      <span className="sr-only">AI Chat</span>
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </main>
      </div>
      {selectedFileId && (
        <div className="w-1/3 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="p-4 flex justify-between items-center bg-transparent">
            <h2 className="text-3xl font-bold" style={{ color: "#0ff" }}>
              AI Chat - File {selectedFileId}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedFileId(null)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4">
            {chatMessages[selectedFileId]?.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-left" : "text-right"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-gray-800 text-cyan-400"
                      : "bg-gray-800 text-pink-400"
                  }`}
                  style={{
                    border: "1px solid currentColor",
                    boxShadow: "0 0 10px currentColor",
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 bg-transparent">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex space-x-2"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-grow bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                style={{
                  boxShadow: "0 0 5px cyan",
                  borderColor: "#0ff",
                  color: "#fff",
                }}
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-white"
                style={{ boxShadow: "0 0 10px #0ff" }}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
