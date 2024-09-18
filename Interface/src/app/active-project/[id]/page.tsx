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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const aiChat = (id: string) => {
    setIsChatOpen(true);
  };

  const addNewFile = () => {
    const newFile: FileItem = {
      id: String(files.length + 1),
      name: `newfile${files.length + 1}.txt`,
      size: "1.0 MB",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setFiles([newFile, ...files]);
  };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        content: currentMessage,
      };
      setChatMessages([...chatMessages, newUserMessage]);
      setCurrentMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: "This is a simulated AI response.",
        };
        setChatMessages((prevMessages) => [...prevMessages, aiResponse]);
      }, 1000);
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
                      onClick={() => aiChat(file.id)}
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/20"
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
      {isChatOpen && (
        <div className="w-1/3 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          {/* Header with Neon Effect */}
          <div className="p-4 flex justify-between items-center bg-transparent">
            <h2
              className="text-3xl font-bold"
              style={{
                color: "#0ff",
              }}
            >
              AI Chat
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Chat Messages */}
          <ScrollArea className="flex-grow p-4">
            {chatMessages.map((message) => (
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
          {/* Input Area */}
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
              />
              <Button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-white"
                style={{ boxShadow: "0 0 10px #0ff" }}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
