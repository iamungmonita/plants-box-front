import React, { useState } from "react";

interface ImageUploadProps {
  previewUrl: string | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleRemoveImage: (e: React.MouseEvent) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  previewUrl,
  setFile,
  setPreviewUrl,
  handleRemoveImage,
}) => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="col-span-2 w-full space-y-4">
      <div
        className="border-2 border-dashed p-4 flex justify-center items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          {previewUrl ? (
            <div className="relative h-56">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-56 h-full object-cover rounded shadow-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-green-800/70 text-white px-3 py-1"
              >
                X
              </button>
            </div>
          ) : (
            "Drag and drop an image here, or click to select or replace"
          )}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
