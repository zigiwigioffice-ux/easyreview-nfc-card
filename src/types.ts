/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CardData {
  businessName: string;
  reviewUrl: string;
  logoDataUrl: string | null;
  logoType: string | null;
}

export interface NfcCard {
  id: string;
  businessName: string;
  reviewUrl: string;
  logoDataUrl: string | null;
  qrCodeSvgString: string | null;
  downloadCount: number;
  createdDate: string;
  createdTime: string;
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  type: "create" | "edit" | "download" | "delete" | "duplicate";
  cardBusinessName: string;
  timestamp: string;
  details: string;
}

export interface RenderOptions {
  scale: number;
}
