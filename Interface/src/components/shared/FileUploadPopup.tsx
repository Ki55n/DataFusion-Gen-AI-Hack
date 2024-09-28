"use client";

import { uploadFileToDb } from "@/db/files";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { changeProjectStatus } from "@/db/project";

interface FileItem {
  file_uuid: string;
  name: string;
  description: string;
  size: string;
  uploadDate: Date;
}

async function uploadFile(
  file: File,
  name: string,
  description: string,
  projectId: string,
  userId: string
) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("projectId", projectId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SQLITE_URL}/upload-file`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("File upload failed");
    }
    const file_uuid = await response.json();
    console.log(file_uuid);

    const filedata = {
      name: name,
      size: file.size,
      dateUploaded: new Date(),
      file_uuid: file_uuid.file_uuid,
    };

    await changeProjectStatus(projectId, "inactive");

    await uploadFileToDb(userId, projectId, description, filedata);

    return {
      file_uuid: filedata.file_uuid,
      name: name,
      size: filedata.size.toString(),
      uploadDate: filedata.dateUploaded,
      description: description,
    };
  } catch (error) {
    console.error("Error occurred during file upload:", error);
    throw error;
  }
}

function FileDragAndDrop({
  onDrop,
  fileName,
}: {
  onDrop: (file: File) => void;
  fileName: string;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    onDrop(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={(e) => e.target.files && onDrop(e.target.files[0])}
      />
      {fileName ? (
        <p>{fileName}</p>
      ) : (
        <p>Drag and drop a file here, or click to select a file</p>
      )}
    </div>
  );
}

export function FileUploadPopup({
  isOpen,
  onClose,
  onUpload,
  projectId,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: FileItem) => void;
  projectId: string;
  user: any;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; file?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (user: any) => {
    setErrors({});
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (!file) {
      setErrors((prev) => ({ ...prev, file: "File is required" }));
      return;
    }

    setIsLoading(true);
    try {
      const uploadedFile = await uploadFile(
        file,
        name,
        description,
        projectId,
        user.uid
      );
      onUpload(uploadedFile);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 bg-black/60 inset-0 flex justify-center items-center">
      <div className="relative bg-gray-900 text-white rounded-2xl p-[max(2vw,2rem)] w-[35vw] h-auto max-h-[90%] overflow-y-auto shadow-lg">
        <button
          className="absolute top-[20px] right-[20px] hover:text-gray-400 transition-colors"
          onClick={onClose}
        >
          <XIcon />
        </button>
        <h2 className="font-bold text-left text-[22px] mb-8 capitalize">
          Add New File
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(user);
          }}
        >
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Name
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <Input
              type="text"
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Upload File
            </label>
            <FileDragAndDrop
              onDrop={(file) => setFile(file)}
              fileName={file?.name || ""}
            />
            {errors.file && (
              <span className="text-red-500 text-sm">{errors.file}</span>
            )}
          </div>

          <div className="flex flex-row justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
