"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, Trash2Icon, UploadIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import { getFilesByUserIdProjectId, uploadFileToDb } from "@/db/files";
import { FileUploadPopup } from "@/components/shared/FileUploadPopup";

interface FileItem {
  file_uuid: string;
  name: string;
  description: string;
  size: string;
  uploadDate: Date;
}

async function getProjectFiles(
  projectId: string,
  userId: string
): Promise<FileItem[]> {
  try {
    if (!userId || !projectId) {
      throw new Error("Invalid userId or projectId");
    }
    console.log("Fetching files for project:", projectId, "and user:", userId);

    const files = await getFilesByUserIdProjectId(userId, projectId);
    console.log("Files fetched successfully:", files);

    return files.map((file) => ({
      file_uuid: file.file_uuid,
      name: file.name,
      description: file.description,
      size: file.size,
      uploadDate: file.dateUploaded,
    }));
  } catch (error) {
    console.error("Error fetching project files:", error);
    throw error;
  }
}

export default function Component({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const { user, loading: authLoading }: any = UserAuth(); // Use 'loading' from auth context
  const router = useRouter();

  const [projectName, setProjectName] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login"); // Redirect to the login page if not authenticated
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!user?.uid) {
          console.error("User is not authenticated");
          return;
        }

        console.log(
          "Fetching project details for user:",
          user.uid,
          "and project:",
          params.id
        );

        const projectFiles = await getProjectFiles(params.id, user.uid);
        setFiles(projectFiles);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [params.id, user]);

  const removeFile = async (id: string) => {
    // Implement file removal logic here
    setFiles(files.filter((file) => file.file_uuid !== id));
  };

  const addNewFile = (newFile: FileItem) => {
    setFiles([newFile, ...files]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="px-6 py-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Project: {projectName} Dashboard</h1>
      </header>
      <main className="flex-grow p-6 overflow-hidden">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Uploaded Files</h2>
          <Button
            onClick={() => setIsUploadPopupOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Add New File
          </Button>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between text-sm font-medium text-gray-400">
            <span className="w-2/5">Name</span>
            <span className="w-1/5">Description</span>
            <span className="w-1/5 text-right">Size</span>
            <span className="w-1/5 text-right">Upload Date</span>
            <span className="w-1/5"></span>
          </div>
          <ScrollArea className="h-[calc(100vh-250px)]">
            {files.map((file) => (
              <div
                key={file.file_uuid}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors duration-150"
              >
                <div className="flex items-center w-2/5">
                  <FileIcon className="mr-3 h-5 w-5 text-blue-400" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <span className="w-1/5 text-gray-400">{file.description}</span>
                <span className="w-1/5 text-right text-gray-400">
                  {file.size}
                </span>
                <span className="w-1/5 text-right text-gray-400">
                  {file.uploadDate.toLocaleDateString()}
                </span>
                <div className="w-1/5 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.file_uuid)}
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
      <FileUploadPopup
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
        onUpload={addNewFile}
        projectId={params.id}
        user={user}
      />
    </div>
  );
}
