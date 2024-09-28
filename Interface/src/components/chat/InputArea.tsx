"use client";

import Image from "next/image";
import { FC, useState, useEffect, useRef } from "react";
import Footer from "./Footer";

type TInputAreaProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
  disabled?: boolean;
  reset?: () => void;
};

const InputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
  disabled,
  reset,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const files = ["file1", "file2", "file3", "file4", "file5"];
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (selectAll) {
      setSelectedFiles([...files]);
    } else {
      setSelectedFiles([]);
    }
  }, [selectAll]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleFileSelect = (file: string) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          const audioBlob = new Blob([event.data], { type: "audio/wav" });
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.wav");

          // Send the audio file to a speech-to-text API
          fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              setPromptValue((prevValue) => prevValue + " " + data.text);
            })
            .catch((error) => {
              console.error("Error converting speech to text:", error);
            });
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone permission denied:", err);
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="relative py-6 w-full mx-auto">
      <form
        className=" flex h-[55px] w-full items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-0 mr-1 py-10 shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (reset) reset();
          handleDisplayResult();
        }}
      >
        <input
          type="text"
          placeholder="Type your query here..."
          className="py-6 px-10 ml-1 w-full text bg-gray-800 border-none rounded-md focus:ring focus:ring-blue-500"
          disabled={disabled}
          value={promptValue}
          required
          onChange={(e) => setPromptValue(e.target.value)}
        />
        <button
          type="button"
          className="px-0 ml-2 outline outline-offset-2 outline-gray-700 bg-gray-800 mt-2 mb-2 rounded-md hover:bg-gray-400"
          onClick={() => setIsSourcesOpen(true)}
        >
          +Add Sources
        </button>

        <button
          type="button"
          className="mb-2 ml-2 mt-2 relative outline outline-gray-700 outline-offset-2 flex px-2 h-[50px] w-[50px] items-center justify-center rounded-md bg-gray-800 hover:bg-gray-750"
          onClick={handleMicClick}
        >
          <Image
            unoptimized
            src={
              isRecording ? "/img/stop-icon.svg" : "/img/microphone-icon.svg"
            }
            alt={isRecording ? "Stop recording" : "Start recording"}
            width={20}
            height={20}
          />
        </button>

        <button
          disabled={disabled}
          type="submit"
          className="mb-2 ml-2 mt-2 mr-1 relative flex h-[50px] w-[50px] items-center justify-center rounded-md bg-blue-500 hover:bg-blue-700"
        >
          <Image
            unoptimized
            src={"/img/arrow-narrow-right.svg"}
            alt="search"
            width={24}
            height={24}
          />
        </button>
      </form>
      {isSourcesOpen && (
        <div className="fixed inset-1 px-4 py-10 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-black text-white p-10 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold bg-slate-600 rounded-md px-2 mb-4">
              Select Files
            </h2>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                Select All
              </label>
            </div>
            <div className="space-y-2">
              {files.map((file) => (
                <label key={file} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file)}
                    onChange={() => handleFileSelect(file)}
                    className="mr-2"
                  />
                  {file}
                </label>
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsSourcesOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputArea;
