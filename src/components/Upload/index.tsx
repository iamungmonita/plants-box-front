import { uploadSingleImage } from "@/services/file";
import Image from "next/image";
import React from "react";

interface ImageUploadProps {
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleRemoveImage: (e: React.MouseEvent) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const { previewUrl, setPreviewUrl, handleRemoveImage } = props;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files ?? [];
    if (files?.length) {
      const selectedFile = files[0];
      const formData = new FormData();
      formData.append("name", selectedFile.name);
      formData.append("file", selectedFile);

      const result = await onUploadImages(formData);
      const previewUrl = result?.url ?? URL.createObjectURL(selectedFile);
      //
      setPreviewUrl(previewUrl);
    }
  };

  const onUploadImages = async (formData: FormData) => {
    try {
      const files = formData.get("file");
      if (!files) {
        return;
      }
      const fileUploaded = await uploadSingleImage(formData);
      setPreviewUrl(fileUploaded?.url);
      return fileUploaded;
    } catch (error) {
      const message = (error as any).message ?? "Somethings Went Wrong";
      alert(message);
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
              <Image
                width={300}
                height={300}
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
