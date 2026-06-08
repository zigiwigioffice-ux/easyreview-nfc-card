/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import QRCodeStyling from "qr-code-styling";

export async function generateQrVectorString(reviewUrl: string): Promise<string> {
  if (!reviewUrl || !reviewUrl.trim()) {
    // Return empty string or fallback QR structure
    return "";
  }

  // Exact configuration properties requested in the Master Prompt
  const qrCode = new QRCodeStyling({
    width: 1600,
    height: 1600,
    type: "svg",
    data: reviewUrl.trim(),
    dotsOptions: {
      type: "dots",
      color: "#000000"
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000000"
    },
    cornersDotOptions: {
      type: "dot",
      color: "#000000"
    },
    backgroundOptions: {
      color: "#FFFFFF"
    },
    qrOptions: {
      errorCorrectionLevel: "H"
    }
  });

  try {
    // Extract raw SVG blob from qr-code-styling
    const blob = await qrCode.getRawData("svg");
    if (!blob) {
      throw new Error("Unable to generate QR code SVG Blob");
    }
    
    // Read contents safely supporting both Browser Blob and Buffer types
    let svgText = "";
    if (typeof (blob as any).text === "function") {
      svgText = await (blob as any).text();
    } else {
      svgText = (blob as any).toString();
    }

    // Parse SVG string to obtain inner vector paths
    const parser = new DOMParser();
    const qrDocument = parser.parseFromString(svgText, "image/svg+xml");
    
    // Select elements to render (skip the outermost svg element itself)
    // We fetch the innerHTML of the parsed SVG element
    const innerSvgContent = qrDocument.documentElement.innerHTML;

    if (!innerSvgContent) {
      throw new Error("Parsed QR code contains empty inner SVG contents");
    }

    // Scale the generated 1600x1600 QR code elements to fit the 1350x1350 template area precisely
    // Scale factor: 1350 / 1600 = 0.84375
    return `<g transform="scale(0.84375)">${innerSvgContent}</g>`;
  } catch (error) {
    console.error("Error generating premium QR code styling:", error);
    // Return a basic fallback vector representation in case of library failures
    return `
      <rect width="1350" height="1350" fill="#F8FAFC" rx="60" />
      <text x="675" y="675" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="64" fill="#EF4444">QR Error - Recalculating</text>
    `;
  }
}
