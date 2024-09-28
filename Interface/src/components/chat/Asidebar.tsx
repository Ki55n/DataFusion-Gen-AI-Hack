import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Hero from "./Hero"; // Make sure Hero.tsx is imported correctly

const Asidebar = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);
  const files = ["file1", "file2", "file3", "file4", "file5"];

  useEffect(() => {
    setFilteredFiles(
      files.filter((file) =>
        file.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className="flex top-0 h-full rounded-md">
      <aside
        className={`bg-gray-900 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-8">
          <h2 className="text-xl text-gray-400 underline font-bold mb-4">
            Table Browser
          </h2>
          <div className="mb-8">
            <input
              type="text"
              placeholder="Find a table"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mr-2 px-2 py-1 border-white bg-gray-600 text-white rounded-md "
            />
          </div>
          <div className="space-y-4">
            {filteredFiles.map((file, index) => (
              <div
                key={index}
                className="p-2 bg-gray-950 font-semibold text-gray-400 hover:bg-slate-600 hover:text-white cursor-pointer rounded shadow"
              >
                {file}
              </div>
            ))}
          </div>
        </div>
      </aside>
      <button
        className="absolute ml-1 transition-all duration-300 ease-in-out"
        style={{ left: isOpen ? "270px" : "0" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronLeft className="bg-gray-600 text-white h-screen w-2" />
        ) : (
          <ChevronRight className="bg-gray-600 text-white h-screen w-2" />
        )}
      </button>
      <div
        className={`flex transition-all duration-300 ease-in-out ${
          isOpen ? "ml-2" : "ml-0"
        }`}
      >
        {showChatbot && (
          <div className="chatbot-container">
            <Hero
              promptValue=""
              setPromptValue={() => {}}
              handleDisplayResult={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Asidebar;
