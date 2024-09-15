"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface FileDragAndDropProps {
  onDrop: (files: any) => void;
  fileName: any;
}

const FileDragAndDrop: React.FC<FileDragAndDropProps> = ({
  onDrop,
  fileName,
}) => {
  const [dragging, setDragging] = useState(false);
  const [fileUrl, setFileUrl] = useState(
    fileName ? getFileNameFromUrl(fileName) : ""
  );
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const allowedExtensions = ["pdf", "txt", "csv"];
  const fileSizeLimit = 25 * 1024 * 1024; // 25MB in bytes

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  function getFileNameFromUrl(url: any) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);

    const files = Array.from(e.dataTransfer.files);

    const invalidFiles = files.filter((file) => {
      const fileExtension: any = file.name.split(".").pop()?.toLowerCase();
      return !allowedExtensions.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      toast.warning("Only PDF and TXT files are allowed.");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > fileSizeLimit);

    if (oversizedFiles.length > 0) {
      toast.warning("File size exceeds the limit (25MB).");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    onDrop(formData);

    if (files.length > 0) {
      setDroppedFile(files[0]);
    }
  };

  const handleBrowseFileClick = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".pdf,.txt, .csv");
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files).filter((file) =>
          allowedExtensions.some((ext) =>
            file.name.toLowerCase().endsWith(`.${ext}`)
          )
        );

        const formData = new FormData();
        files.forEach((file) => {
          formData.append("file", file);
        });

        onDrop(formData);
        if (files.length > 0) {
          setDroppedFile(files[0]);
        }
      }
    };
    input.click();
  };

  const handleRemoveFile = () => {
    setDroppedFile(null);
    setFileUrl("");
    onDrop("");
  };

  return (
    <div
      className={`border-[1px] pc-3 py-5 relative border-[#D6D6D6] rounded-[10px] border-dashed ${
        dragging ? "border-black" : ""
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {droppedFile || fileUrl ? (
        <div className="text-[#A4A4A4] text-center">
          <i
            className="material-icons absolute cursor-pointer top-[10px] right-[10px] duration-300 hover:text-slate-600"
            onClick={handleRemoveFile}
          >
            {" "}
            close{" "}
          </i>
          <p>File Selected</p>
          <p className="text-black text-center">
            {droppedFile ? droppedFile?.name : fileUrl}
          </p>
        </div>
      ) : (
        <div className="text-[#A4A4A4] text-center font-medium">
          <div>
            <span
              className="cursor-pointer text-indigo-600"
              onClick={handleBrowseFileClick}
            >
              Upload
            </span>
            <span> or drag here .txt, .pdf and csv</span>
          </div>
          <p>File size upto 25MB</p>
        </div>
      )}
    </div>
  );
};

export default FileDragAndDrop;
