"use client";

import { ChatPanel } from "@/components/active-project-detail/ChatPanel";
import { FileList } from "@/components/active-project-detail/FileList";
import { useState, useEffect } from "react";
import { getFilesByUserIdProjectId } from "@/db/files";
import { UserAuth } from "@/app/context/AuthContext";

interface FileItem {
  file_uuid: string;
  name: string;
  description: string;
  size: string;
  dateUploaded: Date;
}

interface ComponentProps {
  params?: { id?: string };
}

export default function Component({ params }: ComponentProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const { user }: any = UserAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      const userId = "Gj5EYn2EI5WleriVTBVbkA3F81S2"; // Replace with actual user ID
      const projectId = params?.id || "";
      const fetchedFiles = await getFilesByUserIdProjectId(userId, projectId);
      setFiles(fetchedFiles);
    };

    fetchFiles();
  }, [params?.id]);

  const handleFilesSelect = (file_uuid: string[]) => {
    setSelectedFileIds(file_uuid);
  };

  const handleCleanData = (id: string) => {
    fetch(`${process.env.NEXT_PUBLIC_SQLITE_URL}/download_cleaned_data/${id}`, {
      method: "GET",
    }).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "cleaned_data.csv";
        a.click();
      });
    });
  };

  const handleAnalyzeData = (id: string) => {
    fetch(
      `${process.env.NEXT_PUBLIC_SQLITE_URL}/download_data_analysis/${id}`,
      {
        method: "GET",
      }
    ).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "analyzed_data.csv";
        a.click();
      });
    });
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
          <FileList
            files={files}
            onFilesSelect={handleFilesSelect}
            onCleanData={handleCleanData}
            onAnalyzeData={handleAnalyzeData}
          />
        </main>
      </div>
      <ChatPanel
        selectedFileIds={selectedFileIds}
        files={files}
        project_uuid={params?.id || ""}
      />
    </div>
  );
}
