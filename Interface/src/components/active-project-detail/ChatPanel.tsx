import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import BarChart from "@/components/visualization/BarChart";
import { saveVisualization, Visualization } from "@/db/visualizer";
import Component from "../visualization/PieChart";
import { UserAuth } from "@/app/context/AuthContext";
import LineGraph from "../visualization/LineGraph";
import LineGraphTest from "../visualization/LineGraphtest";
import D3ScatterPlot from "../visualization/ScatterPlot";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  visualization?: string;
  formatted_data_for_visualization?: any;
  summary?: any;
  sql_query?: string;
  user_query?: string;
}

interface ChatPanelProps {
  selectedFileIds: string[];
  files: any[];
  project_uuid: string;
}

export function ChatPanel({
  selectedFileIds,
  files,
  project_uuid,
}: ChatPanelProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user }: any = UserAuth();

  const sendMessage = async () => {
    if (currentMessage.trim() && selectedFileIds.length > 0) {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        content: currentMessage,
      };
      setChatMessages((prev) => [...prev, newUserMessage]);
      setCurrentMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/call-model`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_uuid: project_uuid,
              file_uuids: selectedFileIds,
              question: currentMessage,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content:
          `${data.answer}\n\n` +
          `Generated SQL Query:\n` +
          `\`${data.sql_query}\`\n` ||
            "Sorry, I couldn't process that request.",
          visualization: data.visualization,
          formatted_data_for_visualization:
            data.formatted_data_for_visualization,
          summary: data.visualization_summary,
          user_query: currentMessage,
        };
        setChatMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: "Sorry, there was an error processing your request.",
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveBarVisualization = async (message: ChatMessage) => {
    if (
      message.visualization &&
      message.formatted_data_for_visualization &&
      selectedFileIds.length > 0
    ) {
      const visualizationData: Omit<Visualization, "_id"> = {
        userId: user.uid, // Replace with actual user ID
        fileId: selectedFileIds[0], // Using the first selected file ID
        fileName: message.user_query || "Data Visualization",
        visualizationType: message.visualization,
        data: message.formatted_data_for_visualization.labels.map(
          (label: any, index: any) => ({
            label: label,
            value:
              message.formatted_data_for_visualization.values[0].data[index],
          })
        ),
        description: message.content,
        layout: {
          i: `viz-${Date.now()}`,
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        summary: message.summary,
      };

      const result = await saveVisualization(visualizationData);
      console.log(result);
      console.log("yoyo");
      if (result) {
        console.log("Visualization saved successfully");
        // You can add a notification or update UI here to indicate successful save
      } else {
        console.error("Failed to save visualization");
        // You can add error handling or user notification here
      }
    }
  };
  const handleSavePieVisualization = async (message: ChatMessage) => {
    if (
      message.visualization &&
      message.formatted_data_for_visualization &&
      selectedFileIds.length > 0
    ) {
      const visualizationData: Omit<Visualization, "_id"> = {
        userId: user.uid, // Replace with actual user ID
        fileId: selectedFileIds[0], // Using the first selected file ID
        fileName: message.user_query || "Data Visualization",
        visualizationType: message.visualization,
        data: message.formatted_data_for_visualization.map((item: any) => ({
          label: item.labels,
          value: item.values,
        })),
        description: message.content,
        layout: {
          i: `viz-${Date.now()}`,
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        summary: message.summary,
      };

      const result = await saveVisualization(visualizationData);
      console.log(result);
      console.log("yoyo");
      if (result) {
        console.log("Visualization saved successfully");
        // You can add a notification or update UI here to indicate successful save
      } else {
        console.error("Failed to save visualization");
        // You can add error handling or user notification here
      }
    }
  };
  const handleSaveScatterVisualization = async (message: ChatMessage) => {
    if (
      message.visualization &&
      message.formatted_data_for_visualization &&
      selectedFileIds.length > 0
    ) {
      const visualizationData: Omit<Visualization, "_id"> = {
        userId: user.uid, // Replace with actual user ID
        fileId: selectedFileIds[0], // Using the first selected file ID
        fileName: message.user_query || "Data Visualization",
        visualizationType: message.visualization,
        data: message.formatted_data_for_visualization,
        description: message.content,
        layout: {
          i: `viz-${Date.now()}`,
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        summary: message.summary,
      };

      const result = await saveVisualization(visualizationData);
      console.log(result);
      console.log("yoyo");
      if (result) {
        console.log("Visualization saved successfully");
        // You can add a notification or update UI here to indicate successful save
      } else {
        console.error("Failed to save visualization");
        // You can add error handling or user notification here
      }
    }
  };
  const handleSaveLineVisualization = async (message: ChatMessage) => {
    if (
      message.visualization &&
      message.formatted_data_for_visualization &&
      selectedFileIds.length > 0
    ) {
      const visualizationData: Omit<Visualization, "_id"> = {
        userId: user.uid, // Replace with actual user ID
        fileId: selectedFileIds[0], // Using the first selected file ID
        fileName: message.user_query || "Data Visualization",
        visualizationType: message.visualization,
        data: message.formatted_data_for_visualization,
        description: message.content,
        layout: {
          i: `viz-${Date.now()}`,
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
        summary: message.summary,
      };

      const result = await saveVisualization(visualizationData);
      console.log(result);
      console.log("yoyo");
      if (result) {
        console.log("Visualization saved successfully");
        // You can add a notification or update UI here to indicate successful save
      } else {
        console.error("Failed to save visualization");
        // You can add error handling or user notification here
      }
    }
  };

  return (
    <div className="w-[40%] flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="p-4 flex justify-between items-center bg-transparent">
        <h2 className="text-3xl font-bold" style={{ color: "#0ff" }}>
          AI Chat
        </h2>
      </div>
      <ScrollArea className="flex-grow p-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
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
                wordWrap: "break-word", // Ensure message content wraps to the next line
                whiteSpace: "pre-wrap", // Preserve whitespace and wrap text
                maxWidth: "60%", // Ensure the message does not exceed the parent width
              }}
            >
              {message.content}
            </div>
            {(message.visualization == "horizontal_bar" ||
              message.visualization == "bar") && (
              <div className="mt-2">
                <BarChart
                  data={message.formatted_data_for_visualization.labels.map(
                    (label: any, index: any) => ({
                      label: label,
                      value:
                        message.formatted_data_for_visualization.values[0].data[
                          index
                        ],
                    })
                  )}
                />
                <Button
                  onClick={() => handleSaveBarVisualization(message)}
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="ml-2 h-4 w-4" />
                  Save to Visualizer
                </Button>
              </div>
            )}

            {message.visualization == "pie" && (
              <div className=" mt-2">
                <Component
                  data={message.formatted_data_for_visualization.map(
                    (item: any) => ({
                      label: item.labels,
                      value: item.values,
                    })
                  )}
                />
                <Button
                  onClick={() => handleSavePieVisualization(message)}
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="ml-2 h-4 w-4" />
                  Save to Visualizer
                </Button>
              </div>
            )}

            {message.visualization == "line" && (
              <div>
                <LineGraphTest
                  data={message.formatted_data_for_visualization}
                />
                <Button
                  onClick={() => handleSaveLineVisualization(message)}
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="ml-2 h-4 w-4" />
                  Save to Visualizer
                </Button>
              </div>
            )}
            {message.visualization == "scatter" && (
              <div>
                <D3ScatterPlot
                  data={message.formatted_data_for_visualization}
                />
                <Button
                  onClick={() => handleSaveScatterVisualization(message)}
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="ml-2 h-4 w-4" />
                  Save to Visualizer
                </Button>
              </div>
            )}
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
  );
}
