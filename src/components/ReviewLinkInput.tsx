/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, HelpCircle, Building2, Sparkles } from "lucide-react";

interface ReviewLinkInputProps {
  businessName: string;
  onBusinessNameChange: (val: string) => void;
  reviewUrl: string;
  onReviewUrlChange: (val: string) => void;
}

export default function ReviewLinkInput({
  businessName,
  onBusinessNameChange,
  reviewUrl,
  onReviewUrlChange,
}: ReviewLinkInputProps) {
  
  // High fidelity presets for realistic and professional demonstrations
  const handleLoadPreset = (nameValue: string, urlValue: string) => {
    onBusinessNameChange(nameValue);
    onReviewUrlChange(urlValue);
  };

  return (
    <div id="review-link-form-container" className="space-y-4">
      {/* Business Name Field */}
      <div id="business-name-input-group" className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="businessNameInput" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            Business Name
          </label>
          <span className="text-xs text-slate-400">Controls output filename</span>
        </div>
        <div className="relative">
          <input
            id="businessNameInput"
            type="text"
            className="w-full pl-3.5 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
            placeholder="e.g. Shubham Mandap & Event Decor"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
          />
        </div>
      </div>

      {/* Review URL Field */}
      <div id="review-url-input-group" className="space-y-2">
        <label htmlFor="reviewUrlInput" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Link className="w-4 h-4 text-slate-400" />
          Google Review Link
        </label>
        <div className="relative">
          <textarea
            id="reviewUrlInput"
            rows={3}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-slate-700 resize-none leading-relaxed"
            placeholder="Paste your Google Review, Maps, or Write-Review G link here..."
            value={reviewUrl}
            onChange={(e) => onReviewUrlChange(e.target.value)}
          />
        </div>
      </div>

      {/* Preset Selector Panel */}
      <div id="review-presets-box" className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1 mb-2">
          <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
          Quick Demo Presets
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            id="preset-shubham-btn"
            type="button"
            className="text-left p-2 bg-white hover:bg-blue-50/20 border border-slate-100 rounded-lg text-xs font-medium text-slate-700 truncate cursor-pointer transition-colors"
            onClick={() =>
              handleLoadPreset(
                "Shubham Mandap",
                "https://g.page/r/ChubhamReviewCardDemoLink/review"
              )
            }
          >
            🌟 Shubham Mandap
          </button>
          <button
            id="preset-gourmet-btn"
            type="button"
            className="text-left p-2 bg-white hover:bg-blue-50/20 border border-slate-100 rounded-lg text-xs font-medium text-slate-700 truncate cursor-pointer transition-colors"
            onClick={() =>
              handleLoadPreset(
                "The Royal Gourmet",
                "https://search.google.com/local/writereview?placeid=ChIJu3VnUXS7j5oRzG-O8_i43bA"
              )
            }
          >
            🍔 The Royal Gourmet
          </button>
        </div>
      </div>

      {/* Instructive Help Panel */}
      <div id="review-url-helper" className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl space-y-2">
        <div className="flex items-center gap-1.5 text-slate-600">
          <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
          <h4 className="text-xs font-bold text-slate-700">How to get your static review URL?</h4>
        </div>
        <ul className="list-decimal list-inside text-[11px] text-slate-500 space-y-1 pl-1">
          <li>Search for your business on <span className="font-semibold text-slate-700">Google Maps</span>.</li>
          <li>Click <span className="font-semibold text-slate-700">Share</span>, then copy the short link.</li>
          <li>For direct reviews, use the <span className="font-sans font-semibold text-blue-600">Google Place ID Finder</span> tool to construct your writing link.</li>
        </ul>
      </div>
    </div>
  );
}
