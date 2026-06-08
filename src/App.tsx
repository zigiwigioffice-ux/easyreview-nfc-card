/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Settings2,
  Eye,
  ShieldCheck,
  Heart,
  Plus,
  Trash2,
  Copy,
  History,
  Search,
  Download,
  Calendar,
  Clock,
  Check,
  RotateCcw,
  FileJson,
  PlusCircle,
  FolderLock,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Printer,
  HelpCircle
} from "lucide-react";
import UploadZone from "./components/UploadZone";
import ReviewLinkInput from "./components/ReviewLinkInput";
import NfcCardPreview from "./components/NfcCardPreview";
import { generateQrVectorString } from "./utils/qrGenerator";
import { NfcCard, ActivityLog } from "./types";
import { generateCardSvg } from "./utils/cardSvgGenerator";

// High-fidelity pre-populated templates to ensure a stunning zero-state layout
const INITIAL_DEMO_CARDS = (): NfcCard[] => [
  {
    id: "card-demo-shubham",
    businessName: "Shubham Mandap & Event Decor",
    reviewUrl: "https://g.page/r/ChubhamReviewCardDemoLink/review",
    logoDataUrl: null,
    qrCodeSvgString: null,
    downloadCount: 14,
    createdDate: "Jun 08, 2026",
    createdTime: "04:30 AM",
    lastUpdated: "Jun 08, 2026 at 04:30 AM"
  },
  {
    id: "card-demo-gourmet",
    businessName: "The Royal Gourmet",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJu3VnUXS7j5oRzG-O8_i43bA",
    logoDataUrl: null,
    qrCodeSvgString: null,
    downloadCount: 8,
    createdDate: "Jun 07, 2026",
    createdTime: "02:15 PM",
    lastUpdated: "Jun 07, 2026 at 02:15 PM"
  }
];

const INITIAL_DEMO_LOGS = (): ActivityLog[] => [
  {
    id: "log-1",
    type: "create",
    cardBusinessName: "The Royal Gourmet",
    timestamp: "Jun 07, 2026 at 02:15 PM",
    details: "Created NFC Review Card with custom Google review link."
  },
  {
    id: "log-2",
    type: "download",
    cardBusinessName: "The Royal Gourmet",
    timestamp: "Jun 07, 2026 at 02:40 PM",
    details: "Downloaded high-density CMYK ready PDF format."
  },
  {
    id: "log-3",
    type: "create",
    cardBusinessName: "Shubham Mandap & Event Decor",
    timestamp: "Jun 08, 2026 at 04:30 AM",
    details: "Created NFC Review Card with gradient frame borders."
  }
];

export default function App() {
  // Navigation Menu Active Tab Setup
  const [activeTab, setActiveTab] = useState<"create" | "cards" | "activity" | "settings">("create");

  // Master State Managers
  const [cards, setCards] = useState<NfcCard[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Form State under unified editor model
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("Shubham Mandap & Event Decor");
  const [reviewUrl, setReviewUrl] = useState("https://g.page/r/ChubhamReviewCardDemoLink/review");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  // Dynamic QR Code Compiler States
  const [qrCodeSvgString, setQrCodeSvgString] = useState<string | null>(null);
  const [isQrCompiling, setIsQrCompiling] = useState(false);

  // State for search and filter controls in 'My NFC Cards'
  const [cardSearchQuery, setCardSearchQuery] = useState("");

  // Notification Toast alert feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load persistence collections on start
  useEffect(() => {
    const rawCards = localStorage.getItem("nfc_review_cards");
    const rawLogs = localStorage.getItem("nfc_activity_logs");

    if (rawCards) {
      try {
        setCards(JSON.parse(rawCards));
      } catch (e) {
        setCards(INITIAL_DEMO_CARDS());
      }
    } else {
      const initial = INITIAL_DEMO_CARDS();
      setCards(initial);
      localStorage.setItem("nfc_review_cards", JSON.stringify(initial));
    }

    if (rawLogs) {
      try {
        setLogs(JSON.parse(rawLogs));
      } catch (e) {
        setLogs(INITIAL_DEMO_LOGS());
      }
    } else {
      const initial = INITIAL_DEMO_LOGS();
      setLogs(initial);
      localStorage.setItem("nfc_activity_logs", JSON.stringify(initial));
    }
  }, []);

  // Sync state mutations cleanly back to localStorage
  const persistCards = (updatedCards: NfcCard[]) => {
    setCards(updatedCards);
    localStorage.setItem("nfc_review_cards", JSON.stringify(updatedCards));
  };

  const persistLogs = (updatedLogs: ActivityLog[]) => {
    setLogs(updatedLogs);
    localStorage.setItem("nfc_activity_logs", JSON.stringify(updatedLogs));
  };

  // Compile helper to construct activity timestamps uniformly
  const getFormattedTimestamp = () => {
    const current = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[current.getMonth()];
    const date = String(current.getDate()).padStart(2, "0");
    const year = current.getFullYear();
    
    let hours = current.getHours();
    const minutes = String(current.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // conversion of 0 to 12
    const strHours = String(hours).padStart(2, "0");

    return `${month} ${date}, ${year} at ${strHours}:${minutes} ${ampm}`;
  };

  const getDateComponents = () => {
    const current = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[current.getMonth()];
    const date = String(current.getDate()).padStart(2, "0");
    const year = current.getFullYear();

    let hours = current.getHours();
    const minutes = String(current.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, "0");

    return {
      date: `${month} ${date}, ${year}`,
      time: `${strHours}:${minutes} ${ampm}`
    };
  };

  // Add a system log item
  const logActivity = (type: ActivityLog["type"], business: string, details: string) => {
    const newLog: ActivityLog = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
      type,
      cardBusinessName: business,
      timestamp: getFormattedTimestamp(),
      details
    };
    persistLogs([newLog, ...logs]);
  };

  // Trigger vector QR generation dynamically upon URL modification
  useEffect(() => {
    let active = true;
    const updateQr = async () => {
      if (!reviewUrl.trim()) {
        setQrCodeSvgString(null);
        return;
      }
      setIsQrCompiling(true);
      try {
        const qrSvg = await generateQrVectorString(reviewUrl);
        if (active) {
          setQrCodeSvgString(qrSvg);
        }
      } catch (err) {
        console.error("Failed to compile QR vector tracks:", err);
      } finally {
        if (active) {
          setIsQrCompiling(false);
        }
      }
    };

    const timer = setTimeout(() => {
      updateQr();
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [reviewUrl]);

  // Handle saving generated/edited cards securely
  const handleSaveCard = () => {
    if (!businessName.trim()) {
      showToast("Error: Business Name is a mandated requirement.");
      return;
    }
    if (!reviewUrl.trim()) {
      showToast("Error: Google Review URL cannot remain unoccupied.");
      return;
    }

    const { date, time } = getDateComponents();

    if (editCardId) {
      // Editing Mode - Replace existing card properties parameters
      const updated = cards.map((c) => {
        if (c.id === editCardId) {
          return {
            ...c,
            businessName: businessName.trim(),
            reviewUrl: reviewUrl.trim(),
            logoDataUrl: logoDataUrl,
            qrCodeSvgString: qrCodeSvgString,
            lastUpdated: getFormattedTimestamp()
          };
        }
        return c;
      });

      persistCards(updated);
      logActivity("edit", businessName.trim(), "Regenerated and updated parameters.");
      showToast("Pristine adjustments saved successfully.");
    } else {
      // Creating Mode - Introduce new record structure
      const newCard: NfcCard = {
        id: "card-" + Date.now(),
        businessName: businessName.trim(),
        reviewUrl: reviewUrl.trim(),
        logoDataUrl: logoDataUrl,
        qrCodeSvgString: qrCodeSvgString,
        downloadCount: 0,
        createdDate: date,
        createdTime: time,
        lastUpdated: `${date} at ${time}`
      };

      persistCards([newCard, ...cards]);
      logActivity("create", businessName.trim(), "Constructed new standard card layout configuration.");
      // Load this newly created card ID to the editor automatically to keep state references synchronized
      setEditCardId(newCard.id);
      showToast("Premium card saved to history.");
    }
  };

  // Setup dynamic toast feedback alerts
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Edit action trigger loads existing parameters and switches view active page
  const handleEditTrigger = (card: NfcCard) => {
    setEditCardId(card.id);
    setBusinessName(card.businessName);
    setReviewUrl(card.reviewUrl);
    setLogoDataUrl(card.logoDataUrl);
    setQrCodeSvgString(card.qrCodeSvgString);
    setActiveTab("create");
    showToast(`Loaded ${card.businessName} configuration.`);
  };

  // Duplicate card trigger
  const handleDuplicateTrigger = (card: NfcCard) => {
    const { date, time } = getDateComponents();
    const duplicatedCard: NfcCard = {
      ...card,
      id: "card-" + Date.now() + "-dup",
      businessName: `${card.businessName} (Copy)`,
      downloadCount: 0,
      createdDate: date,
      createdTime: time,
      lastUpdated: `${date} at ${time}`
    };

    persistCards([duplicatedCard, ...cards]);
    logActivity("duplicate", card.businessName, `Duplicated card config into "${duplicatedCard.businessName}".`);
    showToast("Card duplicated successfully!");
    // Auto edit the newly duplicated card
    handleEditTrigger(duplicatedCard);
  };

  // Delete card from persistent database sequence
  const handleDeleteTrigger = (id: string, name: string) => {
    if (confirm(`Are you sure you would like to permanently delete the NFC Card configuration for "${name}"? This action cannot be reversed.`)) {
      const filtered = cards.filter((c) => c.id !== id);
      persistCards(filtered);
      
      // If we deleted the card we were currently editing, reset the fields to defaults
      if (editCardId === id) {
        handleResetFields();
      }

      logActivity("delete", name, "Purged card configuration from client storage files.");
      showToast("Configuration deleted.");
    }
  };

  // Clear editing buffer and start a fresh visual layout
  const handleResetFields = () => {
    setEditCardId(null);
    setBusinessName("New Business");
    setReviewUrl("https://");
    setLogoDataUrl(null);
    setQrCodeSvgString(null);
    showToast("Editor workspace refreshed.");
  };

  // Helper track function for counting downloads
  const handleRegisterDownloadEvent = (format: "pdf") => {
    // If we're editing a card, let's increment its counter!
    if (editCardId) {
      const updated = cards.map((c) => {
        if (c.id === editCardId) {
          return {
            ...c,
            downloadCount: c.downloadCount + 1
          };
        }
        return c;
      });
      persistCards(updated);
    }
    logActivity("download", businessName, "Downloaded high precision file format [.PDF].");
    showToast(".PDF file generated successfully.");
  };

  // Trigger quick download for cards listed in library directly without loading manually there
  const triggerQuickDownload = (card: NfcCard) => {
    // Increment the download count value dynamically
    const updated = cards.map((c) => {
      if (c.id === card.id) {
        return {
          ...c,
          downloadCount: c.downloadCount + 1
        };
      }
      return c;
    });
    persistCards(updated);

    // Track state parameters and create simulated hidden preview container download trigger
    logActivity("download", card.businessName, "Saved file export block directly: [.PDF] format.");
    showToast("Generating PDF directly...");

    // Complete direct browser downloading by injecting a transient preview downloader sequence
    const fileLabel = card.businessName
      .trim()
      .replace(/[^a-zA-Z0-9_\-]/g, "_")
      .replace(/_+/g, "_");

    const masterSv = generateCardSvg({
      ...card,
      logoType: null,
      isForPreview: false
    });

    // PDF requires SVG-to-Canvas rendering. Let's process it safely.
    const cleanSvgString = masterSv.replace(/@import\s+url\([^)]+\);?/g, "");
    const image = new Image();
    const blob = new Blob([cleanSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 4063;
      canvas.height = 6375;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 4063, 6375);

      // Force maximum high-fidelity rasterization and interpolation settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(image, 0, 0, 4063, 6375);

      import("jspdf").then(({ jsPDF }) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: [13.543, 21.25]
        });
        // Generate true print-production quality PDF with NONE compression to prevent banding and lossy downscaling
        pdf.addImage(imgData, "PNG", 0, 0, 13.543, 21.25, undefined, "NONE");
        pdf.save(`${fileLabel}_NFC_Review_Card.pdf`);
        URL.revokeObjectURL(url);
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      showToast("Error generating PDF. Check properties.");
    };
    image.src = url;
  };

  // Filter cards list according to search bar inputs
  const filteredCards = cards.filter((c) =>
    c.businessName.toLowerCase().includes(cardSearchQuery.toLowerCase())
  );

  // Settings: Import JSON backup files
  const handleImportJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.cards && Array.isArray(parsed.cards)) {
          persistCards(parsed.cards);
          if (parsed.logs && Array.isArray(parsed.logs)) {
            persistLogs(parsed.logs);
          }
          logActivity("create", "System Settings", "Imported card database from local backup package successfully.");
          showToast("Data backup restored completely.");
        } else {
          showToast("Invalid JSON schema structure.");
        }
      } catch (err) {
        showToast("Error decoding imported data format.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Clear file value selector
  };

  // Settings: Export JSON backup data package
  const handleExportJsonBackup = () => {
    const dataPackage = {
      cards,
      logs,
      generatorEngine: "Nfc-Card-Review-Manager-Dashboard",
      exportedAt: getFormattedTimestamp()
    };
    const blob = new Blob([JSON.stringify(dataPackage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NFC_Review_Cards_Backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Card backup file downloaded.");
  };

  // Settings: Full Client Storage Purge
  const handleWipeDatabase = () => {
    if (confirm("WARNING: You are about to wipe out all stored review card configurations and histories permanently. This action cannot be undone. Continue?")) {
      persistCards([]);
      persistLogs([]);
      handleResetFields();
      showToast("All stored records have been purged.");
    }
  };

  return (
    <div
      id="root-saas-dashboard"
      className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between"
    >
      {/* Dynamic Action Toast Bar */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 transform animate-bounce shadow-xl flex items-center gap-2.5 px-4.5 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-1 relative">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <aside
          id="dashboard-sidebar-panel"
          className="w-72 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-40"
        >
          {/* Main Top Navigation section */}
          <div className="flex flex-col gap-6 p-6">
            
            {/* Header Identity Branding Block */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
              <div className="p-2 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl text-white shadow-md shadow-indigo-500/10 shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black text-white leading-tight tracking-wider uppercase">
                  NFC Card Deck
                </h1>
                <p className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wide mt-0.5">
                  Internal Dashboard
                </p>
              </div>
            </div>

            {/* Sidebar Navigation Items Menu list */}
            <nav id="sidebar-nav-menu" className="space-y-1.5">
              {/* Option 1: Create New NFC Card */}
              <button
                id="nav-tab-create"
                onClick={() => setActiveTab("create")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "create"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/15"
                    : "hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Card</span>
                </div>
                {editCardId && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-amber-500 text-white rounded font-bold uppercase tracking-wide">
                    Editing
                  </span>
                )}
              </button>

              {/* Option 2: My NFC Cards */}
              <button
                id="nav-tab-cards"
                onClick={() => setActiveTab("cards")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "cards"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/15"
                    : "hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4" />
                  <span>My NFC Cards</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-bold border border-slate-700/60">
                  {cards.length}
                </span>
              </button>

              {/* Option 3: Activity History */}
              <button
                id="nav-tab-activity"
                onClick={() => setActiveTab("activity")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "activity"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/15"
                    : "hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4" />
                  <span>Activity History</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-bold border border-slate-700/60">
                  {logs.length}
                </span>
              </button>

              {/* Option 4: Settings */}
              <button
                id="nav-tab-settings"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "settings"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/15"
                    : "hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings2 className="w-4 h-4" />
                  <span>Settings &amp; Backup</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Secure Environment / Platform Status Sidebar Footer */}
          <div className="p-6 border-t border-slate-800 flex flex-col gap-3">
            <div className="flex items-start gap-2.5 bg-slate-800/40 border border-slate-800 p-3 rounded-xl">
              <FolderLock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Private Offline Mode
                </p>
                <p className="text-[9px] text-slate-400 leading-normal mt-0.5">
                  No cloud database requested. Database stored locally on this machine.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider px-1">
              <span>Engine Status</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>
        </aside>

        {/* ================= PRIMARY CONTENT MAIN CANVASArea ================= */}
        <main className="flex-1 min-w-0 bg-slate-50/40 p-6 sm:p-8 overflow-y-auto max-h-screen">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-wider uppercase mb-1">
                <span>Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-600">
                  {activeTab === "create" && "NFC Card Creator"}
                  {activeTab === "cards" && "My Stored Review Cards"}
                  {activeTab === "activity" && "Activity History Timeline"}
                  {activeTab === "settings" && "Console System Settings"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                {activeTab === "create" && (editCardId ? "Edit NFC Review Card" : "Create New NFC Card")}
                {activeTab === "cards" && "My Stored NFC Cards"}
                {activeTab === "activity" && "Chronological Event logs"}
                {activeTab === "settings" && "Diagnostic Preferences & Backup"}
              </h1>
            </div>

            {/* Quick Actions at top layer bar level */}
            <div className="flex items-center gap-2.5">
              {activeTab === "create" && editCardId && (
                <button
                  id="reset-canvas-quick-btn"
                  onClick={handleResetFields}
                  className="px-3.5 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Start New Draft</span>
                </button>
              )}
              {activeTab !== "create" && (
                <button
                  id="nav-to-creator-btn"
                  onClick={() => {
                    handleResetFields();
                    setActiveTab("create");
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md shadow-indigo-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create NFC Card</span>
                </button>
              )}
            </div>
          </div>

          {/* ================= VIEW SWITCH ROUTER CANVAS ================= */}
          <div id="dynamic-view-viewport-root">
            
            {/* VIEW 1: CREATE CARD SECTION (SPLIT PREVIEW SCREEN) */}
            {activeTab === "create" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Controls Sidebar style Column */}
                <div
                  id="editor-controls-column"
                  className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 border border-indigo-100/50 rounded-lg text-indigo-600">
                        <Settings2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Card Design Parameters
                        </h2>
                        <p className="text-[10px] text-slate-400">
                          Automatic bleed &amp; margins locked matching reference
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logo uploader panel */}
                  <UploadZone
                    currentLogoUrl={logoDataUrl}
                    onLogoLoaded={(dataUrl) => setLogoDataUrl(dataUrl)}
                    onRemoveLogo={() => setLogoDataUrl(null)}
                  />

                  {/* Form input elements fields */}
                  <ReviewLinkInput
                    businessName={businessName}
                    onBusinessNameChange={setBusinessName}
                    reviewUrl={reviewUrl}
                    onReviewUrlChange={setReviewUrl}
                  />

                  {/* Creator Form Button Actions */}
                  <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                    <button
                      id="save-card-state-btn"
                      onClick={handleSaveCard}
                      className="flex-1 py-3 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{editCardId ? "Save Adjusted Card" : "Generate & Save Card"}</span>
                    </button>
                    
                    {editCardId && (
                      <button
                        id="duplicate-card-state-btn"
                        onClick={() => {
                          const currentCardObj = cards.find(c => c.id === editCardId);
                          if (currentCardObj) {
                            handleDuplicateTrigger(currentCardObj);
                          }
                        }}
                        className="py-3 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Duplicate into new card"
                      >
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Duplicate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Vector SVG WYSIWYG Live Preview Mockup Column */}
                <div id="editor-preview-column" className="lg:col-span-7 flex flex-col items-center gap-4">
                  <div className="w-full flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="p-1 px-2 border border-slate-200/50 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        CR80 Standard Template Model
                      </div>
                    </div>
                    {isQrCompiling && (
                      <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1 bg-blue-50 border border-blue-100/30 py-1 px-2.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                        Rendering vector QR paths...
                      </span>
                    )}
                  </div>

                  {/* Unified Live Scaling WYSIWYG render widget */}
                  <NfcCardPreview
                    businessName={businessName}
                    reviewUrl={reviewUrl}
                    logoDataUrl={logoDataUrl}
                    qrCodeSvgString={qrCodeSvgString}
                    onDownload={handleRegisterDownloadEvent}
                  />
                </div>

              </div>
            )}

            {/* VIEW 2: MY NFC CARDS SECTION CONTAINER */}
            {activeTab === "cards" && (
              <div className="space-y-6">
                
                {/* Search Bar filter controls */}
                <div id="search-filter-card-bar" className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="card-search-text-field"
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800"
                      placeholder="Search stored business card parameters..."
                      value={cardSearchQuery}
                      onChange={(e) => setCardSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase shrink-0">
                    Showing {filteredCards.length} of {cards.length} Generated Card decks
                  </div>
                </div>

                {/* Matrix Cards Inventory Display */}
                {filteredCards.length > 0 ? (
                  <div id="digital-library-cards-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCards.map((card) => {
                      // Render tiny miniature version of the SVG for the catalog thumbnail preview
                      const minSvg = generateCardSvg({
                        ...card,
                        logoType: null,
                        isForPreview: true
                      });

                      return (
                        <div
                          key={card.id}
                          className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                        >
                          {/* Scaled Render Panel thumbnail */}
                          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative group">
                            <div className="w-[180px] aspect-[4063/6375] rounded-xl overflow-hidden shadow-md bg-white border border-slate-200/55 transition-transform duration-300 group-hover:scale-[1.03]">
                              <div
                                className="w-full h-full pointer-events-none select-none"
                                dangerouslySetInnerHTML={{ __html: minSvg }}
                              />
                            </div>
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditTrigger(card)}
                                className="p-2.5 bg-white text-slate-800 hover:text-indigo-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>Load Editor</span>
                              </button>
                            </div>
                          </div>

                          {/* Detail Metadata section */}
                          <div className="p-5 space-y-4">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-900 truncate">
                                {card.businessName}
                              </h3>
                              <p className="text-[10px] font-mono text-slate-400 mt-1 truncate hover:text-indigo-600 transition-colors">
                                <span className="font-semibold text-slate-500">Destination URL:</span> {card.reviewUrl}
                              </p>
                            </div>

                            {/* Metrics Logs Row details */}
                            <div className="grid grid-cols-3 gap-1 py-2.5 border-t border-b border-slate-100 text-center bg-slate-50/50 rounded-lg">
                              <div>
                                <p className="text-[8px] text-slate-400 font-extrabold uppercase">Downloads</p>
                                <p className="text-xs font-black text-slate-800 mt-0.5">{card.downloadCount}</p>
                              </div>
                              <div className="col-span-2 border-l border-slate-100 pl-2 text-left">
                                <p className="text-[8px] text-slate-400 font-extrabold uppercase">Last Updated</p>
                                <p className="text-[9px] font-bold text-slate-600 mt-0.5 truncate">{card.lastUpdated}</p>
                              </div>
                            </div>

                            {/* Card Item Command actions Bar */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 pt-1">
                                {/* View / Edit Action button */}
                                <button
                                  onClick={() => handleEditTrigger(card)}
                                  className="flex-1 py-1.5 border border-slate-200 hover:border-slate-300 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
                                >
                                  View / Edit
                                </button>

                                {/* Duplicate Action Button */}
                                <button
                                  onClick={() => handleDuplicateTrigger(card)}
                                  className="py-1.5 px-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                  title="Duplicate Config"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Action Button */}
                                <button
                                  onClick={() => handleDeleteTrigger(card.id, card.businessName)}
                                  className="py-1.5 px-2.5 border border-red-100 hover:border-red-200 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                  title="Delete Card"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Single Direct Download PDF Action */}
                              <button
                                onClick={() => triggerQuickDownload(card)}
                                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-[11px] font-bold text-white rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-500/15"
                              >
                                <Download className="w-3.5 h-3.5 text-white" />
                                <span>Download Print-Ready PDF</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
                    <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-slate-800">No matching stored records found</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Generate a new premium NFC review card configuration using our Creator Workspace tab or adjust filters.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: SYSTEM AUDIT EVENTS LOG TIMELINE */}
            {activeTab === "activity" && (
              <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Client Console Audit Timeline</span>
                  <button
                    onClick={() => {
                      if (confirm("Would you like to empty the diagnostic events timeline?")) {
                        persistLogs([]);
                        showToast("Audit logs cleared.");
                      }
                    }}
                    disabled={logs.length === 0}
                    className="text-xs text-red-500 font-bold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                  >
                    Clear timeline
                  </button>
                </div>

                {logs.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {logs.map((log) => {
                      return (
                        <div key={log.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                          <div className="mt-0.5">
                            {log.type === "create" && (
                              <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/50 text-emerald-600 flex items-center justify-center text-xs font-extrabold">+</span>
                            )}
                            {log.type === "edit" && (
                              <span className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100/50 text-amber-600 flex items-center justify-center text-xs font-extrabold">E</span>
                            )}
                            {log.type === "download" && (
                              <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600 flex items-center justify-center text-xs font-extrabold">D</span>
                            )}
                            {log.type === "delete" && (
                              <span className="w-8 h-8 rounded-lg bg-red-50 border border-red-100/50 text-red-600 flex items-center justify-center text-xs font-extrabold">X</span>
                            )}
                            {log.type === "duplicate" && (
                              <span className="w-8 h-8 rounded-lg bg-blue-50 border border-indigo-100/30 text-indigo-700 flex items-center justify-center text-xs font-extrabold">C</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">
                                {log.type === "create" && "Card Generated"}
                                {log.type === "edit" && "Metadata Updated"}
                                {log.type === "download" && "Print Asset Exported"}
                                {log.type === "delete" && "Configuration Purged"}
                                {log.type === "duplicate" && "Object Cloned"}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {log.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              <span className="font-extrabold text-slate-800">Business:</span> {log.cardBusinessName} &bull; {log.details}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-16 text-center text-slate-400 text-xs font-semibold">
                    No diagnostic events logged yet. Actions you perform will populate this list automatically.
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: SYSTEM CONSOLE PREFERENCES AND BACKUP SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                
                {/* Panel 1: JSON Importers/Exporters */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <FileJson className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Stored Data Management</h3>
                      <p className="text-xs text-slate-400">Export deck snapshots or load them into browser database storage securely</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* JSON Export Block */}
                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase">Export Stored Cards Deck</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Download complete cards and logs to local text backup file.</p>
                      </div>
                      <button
                        onClick={handleExportJsonBackup}
                        className="py-2 px-3.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save JSON</span>
                      </button>
                    </div>

                    {/* JSON Import Block */}
                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase">Import backup snapshot</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Upload a previously saved JSON snapshot back into space.</p>
                      </div>
                      <label className="py-2.5 px-3.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                        <FileJson className="w-3.5 h-3.5" />
                        <span>Load Backup</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportJsonBackup}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Panel 2: Printable CR80 PVC Specs */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <Printer className="w-5 h-5 text-cyan-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Physical Printing Specs</h3>
                      <p className="text-xs text-slate-400">Parameters matched specifically for professional magnetic card print lines</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">Standard Dimensions</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">3.375" x 2.125" (CR80)</p>
                      <p className="text-[10px] text-slate-500 mt-1">Default payment/ID-card format.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">Full Print Resolution</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">4063 x 6375 pixels (300 DPI)</p>
                      <p className="text-[10px] text-slate-500 mt-1">Zero bleed loss vector tracks.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">NFC Configuration</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">Tap/NTAG213, NTAG215, NTAG216</p>
                      <p className="text-[10px] text-slate-500 mt-1">Write destinations precisely onto chip segments.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/40 border border-amber-100/50 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <HelpCircle className="w-4 h-4 shrink-0 text-amber-500" />
                      How to program your physical NFC tags/cards:
                    </h4>
                    <p className="text-[11px] text-amber-700/90 leading-relaxed">
                      1. Purchase standard printable blank PVC cards with built-in NFC NTAG215 chips.<br />
                      2. Download the free app <span className="font-extrabold text-slate-800">NFC Tools</span> on Android or iOS devices.<br />
                      3. Select Write &rarr; Add Record &rarr; URL/URI &rarr; Paste your specific Google review link inside.<br />
                      4. Tap Write, then hold the cards near your device coil to burn the data permanently.<br />
                      5. Print your custom downloaded PDF CMYK asset files directly on card faces with a specialized card printer!
                    </p>
                  </div>
                </div>

                {/* Panel 3: Reset Storage Database */}
                <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide">Danger Zone</h3>
                    <p className="text-xs text-slate-400 mt-1">Permanently deplete and purge offline data structures storage archives</p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleWipeDatabase}
                      className="py-3 px-5 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Clear Storage Database
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </main>

      </div>

      {/* Primary Footer segment */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-4.5 px-6 shrink-0 z-40 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
        <span>NFC Review Card Deck Engine</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mt-0.5 mx-1" />
        <span>&bull; Export Specifications: 4063 x 6375 px (300 DPI CMYK ready)</span>
      </footer>
    </div>
  );
}
