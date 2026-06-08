/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { Upload, X, FileImage, ShieldAlert } from "lucide-react";

interface UploadZoneProps {
  onLogoLoaded: (dataUrl: string, fileType: string) => void;
  onRemoveLogo: () => void;
  currentLogoUrl: string | null;
}

export default function UploadZone({
  onLogoLoaded,
  onRemoveLogo,
  currentLogoUrl,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate size (20MB Limit)
    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage("File exceeds 20MB size limit. Please upload a smaller logo.");
      return;
    }

    // Validate type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid format. Please upload a PNG, JPG, WEBP, or SVG image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onLogoLoaded(dataUrl, file.type);
      } else {
        setErrorMessage("Could not parse file data. If this persists, please try an alternative image.");
      }
    };
    reader.onerror = () => {
      setErrorMessage("Unable to read the selected file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="upload-zone-wrapper" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 block">
          Business Logo
        </label>
        <span className="text-xs text-slate-400">Fixed size, auto center-crop</span>
      </div>

      {currentLogoUrl ? (
        <div
          id="active-logo-preview"
          className="flex items-center gap-4 p-4 border border-slate-200 bg-slate-50/50 rounded-xl"
        >
          <div className="relative w-16 h-16 rounded-full border border-slate-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
            <img
              src={currentLogoUrl}
              alt="Logo Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              Logo attached
            </p>
            <p className="text-xs text-slate-500">
              Crop matching the circular grid template
            </p>
          </div>
          <button
            id="remove-logo-btn"
            onClick={onRemoveLogo}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Remove Logo"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          id="dropzone-container"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50/30 scale-[1.01]"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp,.svg"
            onChange={handleFileChange}
          />
          <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl mb-3 shadow-sm hover:scale-105 transition-transform duration-200">
            <Upload className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Drag &amp; drop logo, or <span className="text-blue-600 font-bold">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
            PNG, JPG, WEBP, or SVG (Up to 20MB)
          </p>
        </div>
      )}

      {errorMessage && (
        <div
          id="upload-error-alert"
          className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
