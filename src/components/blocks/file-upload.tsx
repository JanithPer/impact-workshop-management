"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload } from "lucide-react";

// Define the type for an uploaded file
interface UploadedFile {
  name: string;
  size: number;
  url: string;
}

export default function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([ ]);

  // Handle drag and drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove a file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
    return `${(size / (1024 * 1024)).toFixed(0)} MB`;
  };

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-4">Upload</h2>
      <div className="flex flex-col gap-4">
        {/* Drag and Drop Area */}
        <div className="flex-1 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex justify-center mb-2">
             <Upload />
            </div>
            <p className="text-gray-400">
              Drag 'n' drop files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              (You can upload files up to 2 MB each)
            </p>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Uploaded Files List */}
        <div className="flex flex-col">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border-b border-gray-700"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={file.url}
                  alt={file.name}
                  width={40}
                  height={40}
                  className="rounded-full object-fill"
                />
                <div>
                  <p className="text-sm">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))}
          <Button className="w-full mt-4">Upload</Button>
        </div>
      </div>
    </div>
  );
}