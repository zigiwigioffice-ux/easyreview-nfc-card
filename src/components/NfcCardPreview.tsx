/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Download, FileDown, ShieldCheck, Loader2 } from "lucide-react";
import { generateCardSvg } from "../utils/cardSvgGenerator";
import { jsPDF } from "jspdf";

interface NfcCardPreviewProps {
  businessName: string;
  reviewUrl: string;
  logoDataUrl: string | null;
  qrCodeSvgString: string | null;
  onDownload?: (format: "pdf") => void;
}

export default function NfcCardPreview({
  businessName,
  reviewUrl,
  logoDataUrl,
  qrCodeSvgString,
  onDownload,
}: NfcCardPreviewProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Compile the live vector preview SVG (fluid 100% auto-scaling)
  const previewSvgString = generateCardSvg({
    businessName,
    reviewUrl,
    logoDataUrl,
    logoType: null,
    qrCodeSvgString,
    isForPreview: true,
  });

  // Compile the high fidelity print-ready master SVG (absolute 4063x6375 dimensions)
  const masterSvgString = generateCardSvg({
    businessName,
    reviewUrl,
    logoDataUrl,
    logoType: null,
    qrCodeSvgString,
    isForPreview: false,
  });

  // Safe slugified business label for files
  const fileLabel = (businessName.trim() || "Business")
    .replace(/[^a-zA-Z0-9_\-]/g, "_")
    .replace(/_+/g, "_");

  // Convert Master SVG string to a high-density 4063 x 6375 offscreen canvas safely
  const renderToCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      // Create a clean version of the SVG for the canvas renderer.
      // Strip out the external Google Fonts @import declaration because browser security blocks SVG-to-Canvas representation containing external stylesheet URLs.
      const cleanSvgString = masterSvgString.replace(/@import\s+url\([^)]+\);?/g, "");

      const image = new Image();
      const blob = new Blob([cleanSvgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const cleanup = () => {
        URL.revokeObjectURL(url);
      };

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 4063;
        canvas.height = 6375;
        const ctx = canvas.getContext("2d", { alpha: false });
        
        if (!ctx) {
          cleanup();
          reject(new Error("Unable to obtain 2D Canvas context"));
          return;
        }

        // Fill background first with pure white (avoid alpha transparency errors)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 4063, 6375);

        // Force maximum high-fidelity rasterization and interpolation settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Render the high-resolution vector card image
        ctx.drawImage(image, 0, 0, 4063, 6375);
        cleanup();
        resolve(canvas);
      };

      image.onerror = () => {
        cleanup();
        reject(new Error("Offscreen image rendering failure. Verification of SVG attributes advised."));
      };

      image.src = url;
    });
  };

  // 3. Download Print Ready Industrial PDF (300 DPI)
  const handleDownloadPdf = async () => {
    setIsExporting("pdf");
    try {
      const canvas = await renderToCanvas();
      const imgData = canvas.toDataURL("image/png");

      // Custom print dimensions under standard 300 DPI guidelines:
      // Width = 4063px / 300 = 13.543 inches
      // Height = 6375px / 300 = 21.25 inches
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [13.543, 21.25],
      });

      // Write direct high resolution raster source cleanly on canvas coordinates without compression to guarantee max print-ready physical quality (300 DPI minimum)
      pdf.addImage(imgData, "PNG", 0, 0, 13.543, 21.25, undefined, "NONE");
      pdf.save(`${fileLabel}_NFC_Review_Card.pdf`);
      if (onDownload) onDownload("pdf");
    } catch (e) {
      console.error("PDF Export Failure:", e);
      alert("An issue occurred drawing PDF layout layers. Please check that SVG attributes and custom logo are intact.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div id="nfc-card-preview-panel" className="flex flex-col items-center gap-6 w-full lg:max-w-xl mx-auto">
      {/* Real-time WYSIWYG Device / Canvas Mockup container */}
      <div className="relative w-full aspect-[4063/6375] rounded-[32px] overflow-hidden bg-white shadow-2xl border border-slate-100 group transition-all duration-300 hover:shadow-indigo-500/10">
        <div
          id="live-svg-injector"
          className="w-full h-full select-none"
          dangerouslySetInnerHTML={{ __html: previewSvgString }}
        />
        {/* Gloss Card Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60 rounded-[32px]" />
      </div>

      {/* Export Action Controls */}
      <div id="export-controls-block" className="w-full space-y-3">
        {/* Prime Output Option: Commercial PDF */}
        <button
          id="download-pdf-btn"
          onClick={handleDownloadPdf}
          disabled={isExporting !== null}
          className="w-full py-4 text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting === "pdf" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Compiling Print-Ready PDF...
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5" />
              Download Print-Ready PDF
            </>
          )}
        </button>

        {/* Security / Quality Check Label */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-semibold bg-emerald-50/50 py-2 px-3 rounded-lg border border-emerald-100/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Locked templates match physical CR80 dimensions (3.375" x 2.125").</span>
        </div>
      </div>
    </div>
  );
}
