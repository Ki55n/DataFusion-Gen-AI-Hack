"use client";
import react, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FileDragAndDrop from "./DragDrop";

export default function AddSplunkKnowledgeBase({
  hide,
  isEditMode,
  collectionData,
  makeGetAPICall,
}: any) {
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState(
    isEditMode ? collectionData.fileUrl : ""
  );
  const [name, setName] = useState(isEditMode ? collectionData.name : "");
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    let errors: any = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = "Knowledge base name is required";
      isValid = false;
    }

    if (!file) {
      errors.file = "File is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleDrop = (fileData: any) => {
    setFile(fileData);
    if (fileData) {
      uploadFile(fileData);
    }
  };

  const uploadFile = async (formData: any) => {
    try {
    } catch (error) {
      setLoader(false);
      console.error("Error occurred", error);
    }

    setLoader(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      try {
      } catch (error: any) {
        setLoader(false);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      {loader && <div className="text-center text-white">Loading...</div>}
      <div className="fixed z-50 bg-black/60 inset-0 flex justify-center items-center">
        <div className="relative bg-gray-900 text-white rounded-2xl p-[max(2vw,2rem)] w-[35vw] h-auto max-h-[90%] overflow-y-auto shadow-lg">
          <i
            className="material-icons text-white absolute cursor-pointer top-[20px] right-[20px] hover:text-gray-400 transition-colors"
            onClick={hide}
          >
            close
          </i>
          <h2 className="font-bold text-left text-[22px] mb-8 capitalize">
            {isEditMode ? "Edit" : "Add New"} Data
          </h2>
          <form>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
              {errors?.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Upload File
              </label>
              <FileDragAndDrop onDrop={handleDrop} fileName={fileUrl} />
              {errors?.file && (
                <span className="text-red-500 text-sm">{errors.file}</span>
              )}
            </div>

            <div className="flex flex-row justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-700 text-white rounded-lg py-2 px-6 text-base font-medium hover:bg-gray-600 transition-colors"
                onClick={hide}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-blue-600 text-white rounded-lg py-2 px-6 text-base font-medium hover:bg-blue-500 transition-colors"
                onClick={handleSubmit}
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
