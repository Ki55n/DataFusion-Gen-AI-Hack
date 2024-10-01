"use client";

import { ChatPanel } from "@/components/active-project-detail/ChatPanel";
import { FileList } from "@/components/active-project-detail/FileList";
import { useState, useEffect } from "react";
import { getFilesByUserIdProjectId } from "@/db/files";
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const { user, loading: authLoading }: any = UserAuth(); // Use 'loading' from auth context
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login"); // Redirect to the login page if not authenticated
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // console.log(user.uid);
    // console.log("first");
    const fetchFiles = async () => {
      if (user) {
        const userId = user.uid; // Replace with actual user ID
        const projectId = params?.id || "";
        const fetchedFiles = await getFilesByUserIdProjectId(userId, projectId);
        setFiles(fetchedFiles);
      }
    };

    fetchFiles();
  }, [params?.id, user]);

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
        a.download = "analyzed_data.pdf ";
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
