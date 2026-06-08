/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardData } from "../types";

export interface SvgGeneratorProps extends CardData {
  qrCodeSvgString: string | null;
  isForPreview?: boolean;
}

export function generateCardSvg({
  businessName,
  reviewUrl,
  logoDataUrl,
  qrCodeSvgString,
  isForPreview = false,
}: SvgGeneratorProps): string {
  const name = businessName.trim() || "Business";
  const initials = name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase() || "B";

  // If no QR code styling is compiled yet, we create a fallback placeholder box.
  const embeddedQr = qrCodeSvgString
    ? `
    <!-- Vector embedded QR code -->
    <g transform="translate(1356.5, 3375)">
      ${qrCodeSvgString}
    </g>
    `
    : `
    <!-- Fallback QR visual placeholder -->
    <g transform="translate(1356.5, 3375)">
      <rect width="1350" height="1350" fill="#F1F5F9" rx="80" ry="80" />
      <text x="675" y="675" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="70" fill="#94A3B8">Generating QR Code...</text>
    </g>
    `;

  // Circular Logo Frame
  // If logoDataUrl is available, we display the image inside a perfect circle mask.
  // Otherwise, we render a highly premium gradient monogram using the business initials.
  const logoSection = logoDataUrl
    ? `
    <!-- User Uploaded Logo Circle -->
    <g id="logo-container">
      <defs>
        <clipPath id="logo-clip">
          <circle cx="2031.5" cy="1060" r="420" />
        </clipPath>
      </defs>
      <!-- Base Background inside Logo circle to guarantee transparency handles safely -->
      <circle cx="2031.5" cy="1060" r="420" fill="#FFFFFF" />
      <!-- Logo image scaled and center-cropped via clipPath and preserveAspectRatio -->
      <image href="${logoDataUrl}" x="1611.5" y="640" width="840" height="840" clip-path="url(#logo-clip)" preserveAspectRatio="xMidYMid slice" referrerPolicy="no-referrer" />
    </g>
    `
    : `
    <!-- Premium Monogram Minimalist Art -->
    <g id="logo-container">
      <circle cx="2031.5" cy="1060" r="420" fill="url(#monogram-grad)" />
      <text x="2031.5" y="1150" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-weight="800" font-size="280" fill="#FFFFFF" letter-spacing="-5">${initials}</text>
    </g>
    `;

  const preamble = isForPreview ? "" : `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`;
  const widthVal = isForPreview ? "100%" : "4063";
  const heightVal = isForPreview ? "100%" : "6375";

  return `${preamble}<svg width="${widthVal}" height="${heightVal}" viewBox="0 0 4063 6375" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Master Google Fonts @import to support beautiful, consistent vector-safe fonts -->
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&amp;family=Plus+Jakarta+Sans:wght@700;800;900&amp;display=swap');
      
      .font-serif {
        font-family: 'Playfair Display', 'Georgia', serif;
      }
      
      .font-sans {
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      }
    </style>

    <!-- Master Instagram Border/Ring/QR Frame Linear Gradient -->
    <linearGradient id="instagram-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00D2FF" />     <!-- Cyan -->
      <stop offset="18%" stop-color="#0066FF" />    <!-- Royal Blue -->
      <stop offset="42%" stop-color="#7F00FF" />    <!-- Violet / Purple -->
      <stop offset="68%" stop-color="#FF007F" />    <!-- Premium Pink -->
      <stop offset="85%" stop-color="#FF5E3A" />    <!-- Vibrant Orange -->
      <stop offset="100%" stop-color="#FFD100" />   <!-- Sun Yellow -->
    </linearGradient>

    <!-- Header Gradient for "Service?" -->
    <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E6091" />
      <stop offset="35%" stop-color="#0077B6" />
      <stop offset="70%" stop-color="#0096C7" />
      <stop offset="100%" stop-color="#00B4D8" />
    </linearGradient>

    <!-- Fallback Monogram BG gradient -->
    <linearGradient id="monogram-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#60A5FA" />
    </linearGradient>

    <!-- Star Symbol Def for precise five-gold-star alignment -->
    <g id="star-symbol">
      <!-- 5 point gold star -->
      <path d="M 0,-85 L 25,-30 L 85,-25 L 40,15 L 55,75 L 0,40 L -55,75 L -40,15 L -85,-25 L -25,-30 Z" fill="#FBBF24" stroke="#D97706" stroke-width="6" stroke-linejoin="round" />
    </g>

    <!-- Drop Shadow Filter for Button and Premium Elements -->
    <filter id="button-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#1E293B" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Complete Card Canvas Background -->
  <rect width="4063" height="6375" fill="#FFFFFF" />

  <!-- Outermost Instagram-style Rounded Card Border -->
  <rect x="120" y="120" width="3823" height="6135" rx="200" ry="200" stroke="url(#instagram-grad)" stroke-width="80" fill="none" />

  <!-- ================= LOGO CONTAINER ================= -->
  <!-- Gorgeous outer Ring Gradient -->
  <circle cx="2031.5" cy="1060" r="480" stroke="url(#instagram-grad)" stroke-width="45" fill="none" />
  <!-- Inner circular contrast separator (White Gap) -->
  <circle cx="2031.5" cy="1060" r="455" fill="#FFFFFF" />
  
  <!-- Logo Circle mask layer (either custom logo or monogram) -->
  ${logoSection}

  <!-- ================= HEADER SECTION ================= -->
  <!-- "Loved our Service?" styled beautifully to recreate reference and preserve spacing -->
  <text x="2031.5" y="1960" text-anchor="middle" class="font-serif" font-weight="700" font-size="285" fill="#132B50" letter-spacing="-3">Loved our <tspan fill="url(#text-gradient)">Service?</tspan></text>

  <!-- ================= FIVE GOLD STARS ================= -->
  <g id="stars-group">
    <use href="#star-symbol" x="0" y="0" transform="translate(1551.5, 2370) scale(1.15)" />
    <use href="#star-symbol" x="0" y="0" transform="translate(1791.5, 2370) scale(1.15)" />
    <use href="#star-symbol" x="0" y="0" transform="translate(2031.5, 2370) scale(1.15)" />
    <use href="#star-symbol" x="0" y="0" transform="translate(2271.5, 2370) scale(1.15)" />
    <use href="#star-symbol" x="0" y="0" transform="translate(2511.5, 2370) scale(1.15)" />
  </g>

  <!-- ================= INSTRUCTION TEXT ================= -->
  <!-- "Scan &rarr; Select Copy &amp; Post on Google" centered with bold presentation -->
  <!-- Elegant background capsule matching the approved master template -->
  <rect x="931.5" y="2610" width="2200" height="200" rx="100" fill="#F8FAFC" stroke="#EEF2F6" stroke-width="8" />
  <text x="2031.5" y="2745" text-anchor="middle" class="font-sans" font-weight="800" font-size="100" fill="#132B50" letter-spacing="1">Scan → Select Copy &amp; Post on Google</text>

  <!-- ================= QR CODE WRAPPER ================= -->
  <!-- Instagram gradient QR Frame -->
  <rect x="1231.5" y="3250" width="1600" height="1600" rx="140" ry="140" fill="none" stroke="url(#instagram-grad)" stroke-width="50" />
  <!-- Inner White contrast background for premium look and best scanning readability -->
  <rect x="1261.5" y="3280" width="1540" height="1540" rx="110" ry="110" fill="#FFFFFF" />

  <!-- Vector Embedded QR Code -->
  ${embeddedQr}

  <!-- ================= NFC INDICATOR SECTOR ================= -->
  <g id="nfc-indicators">
    <!-- SMARTPHONE TAP ICON AND LABEL -->
    <g transform="translate(1351.5, 5020)">
      <!-- Smartphone device background (slightly tilted to mimic physical hand tapping) -->
      <rect x="35" y="30" width="100" height="170" rx="16" fill="none" stroke="#132B50" stroke-width="12" />
      <!-- Screen line/notch -->
      <line x1="65" y1="42" x2="105" y2="42" stroke="#132B50" stroke-width="6" stroke-linecap="round" />
      <!-- Home button -->
      <circle cx="85" cy="178" r="8" fill="#132B50" />
      
      <!-- NFC signal waves - cleanly centered & monochromatic navy blue -->
      <path d="M 155,75 A 45,45 0 0,1 155,145" fill="none" stroke="#132B50" stroke-width="10" stroke-linecap="round" />
      <path d="M 180,55 A 75,75 0 0,1 180,165" fill="none" stroke="#132B50" stroke-width="10" stroke-linecap="round" />
      <path d="M 205,35 A 105,105 0 0,1 205,185" fill="none" stroke="#132B50" stroke-width="10" stroke-linecap="round" />
      
      <!-- Labeled under smartphone icon -->
      <text x="120" y="270" text-anchor="middle" class="font-sans" font-weight="950" font-size="70" fill="#132B50" letter-spacing="4">TAP</text>
    </g>

    <!-- BULLET DIVIDER TEXT - PERFECTLY CENTERED VERTICALLY AND HORIZONTALLY (SAME VISUAL NAVY COLOR) -->
    <text x="2031.5" y="5170" text-anchor="middle" class="font-sans" font-weight="950" font-size="80" fill="#132B50">• or •</text>

    <!-- SCAN FRAME AND LABEL -->
    <g transform="translate(2471.5, 5020)">
      <!-- Outer target boundary focus corners (Symmetric scale 175 height matching TAP smartphone) -->
      <!-- Top-Left corner of Scan frame -->
      <path d="M 45,65 L 45,30 L 80,30" fill="none" stroke="#132B50" stroke-width="12" stroke-linecap="round" />
      <!-- Top-Right corner of Scan frame -->
      <path d="M 160,30 L 195,30 L 195,65" fill="none" stroke="#132B50" stroke-width="12" stroke-linecap="round" />
      <!-- Bottom-Left corner of Scan frame -->
      <path d="M 45,170 L 45,205 L 80,205" fill="none" stroke="#132B50" stroke-width="12" stroke-linecap="round" />
      <!-- Bottom-Right corner of Scan frame -->
      <path d="M 160,205 L 195,205 L 195,170" fill="none" stroke="#132B50" stroke-width="12" stroke-linecap="round" />
      
      <!-- Simulated matrix QR elements inside scanner -->
      <rect x="80" y="65" width="30" height="30" fill="#132B50" />
      <rect x="130" y="65" width="30" height="30" fill="#132B50" />
      <rect x="80" y="115" width="30" height="30" fill="#132B50" />
      
      <!-- Clean monochromatic scanning indicators -->
      <rect x="130" y="115" width="15" height="15" fill="#132B50" />
      <rect x="145" y="130" width="15" height="15" fill="#132B50" />
      
      <!-- Perfect monochromatic scan guide line -->
      <line x1="25" y1="117.5" x2="215" y2="117.5" stroke="#132B50" stroke-width="8" stroke-linecap="round" />
      
      <!-- Labeled under scanner icon -->
      <text x="120" y="270" text-anchor="middle" class="font-sans" font-weight="950" font-size="70" fill="#132B50" letter-spacing="4">SCAN</text>
    </g>
  </g>

  <!-- ================= GOOGLE REVIEW BUTTON ================= -->
  <!-- Premium rounded pill with correct dimensions, border and soft shadow decoration -->
  <rect x="831.5" y="5650" width="2400" height="380" rx="190" fill="#EEF2F6" stroke="#E2E8F0" stroke-width="4" filter="url(#button-shadow)" />
  
  <g id="google-pill-contents">
    <!-- Official Google G SVG Logo - Standard official brand segments of 24x24 native resolution, perfectly centered and balanced -->
    <g transform="translate(1199, 5750) scale(7.5)">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18c-.75 1.49-1.18 3.17-1.18 4.94s.43 3.45 1.18 4.93l2.85-2.22.81-2.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </g>
    <!-- Label: "Leave a Google Review" right of logo - perfectly balanced, centered horizontally as one group -->
    <text x="1444" y="5878" class="font-sans" font-weight="800" font-size="110" fill="#132B50">Leave a Google Review</text>
  </g>
</svg>
`;
}
