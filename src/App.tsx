/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Trees,
  Flame,
  BookOpen,
  Database,
  Shield,
  Layers,
  Compass,
  AlertTriangle,
  Award,
  BookMarked,
  LayoutDashboard,
  MapPin,
  Sparkles,
  Heart
} from "lucide-react";
import {
  UserRole,
  IncidentReport,
  TreePlanting,
  ReportStatus,
  ReportCategory,
  TreeSpecies
} from "./types";

// Import custom academic subcomponents
import ChapterReader from "./components/ChapterReader";
import InteractiveMap from "./components/InteractiveMap";
import IncidentForm from "./components/IncidentForm";
import Dashboard from "./components/Dashboard";
import DatabaseSchema from "./components/DatabaseSchema";
import APISandbox from "./components/APISandbox";

// ==========================================
// INITIAL ACADEMIC SEED DATA
// ==========================================
const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 101,
    reporterId: 12,
    reporterName: "Hassan Bello",
    category: ReportCategory.ILLEGAL_LOGGING,
    lga: "Maru",
    latitude: 11.9215,
    longitude: 5.7812,
    description: "Spotted severe wood felling activity in the northern zone. Indigenous Shea trees (Vitellaria paradoxa) are being systematically harvested for charcoal production. Several piles of felling residues are left unguarded.",
    imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=400",
    status: ReportStatus.PENDING,
    createdAt: "2026-07-05T14:30:00-07:00",
  },
  {
    id: 102,
    reporterId: 15,
    reporterName: "Ibrahim Gusau",
    category: ReportCategory.BUSH_BURNING,
    lga: "Talata Mafara",
    latitude: 12.5582,
    longitude: 6.0611,
    description: "Active agricultural slash-and-burn clearing is expanding. The fires are burning uncontrolled near the forest reservation borders, resulting in heavy ash depositions and microclimatic heat cycles.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400",
    status: ReportStatus.VERIFIED,
    verifiedBy: 3,
    verifiedDate: "2026-07-05",
    officerRemarks: "On-site review confirmed burning violations. Met with local farm leaders to enforce safety buffer rules. Map plot verified.",
    createdAt: "2026-07-04T09:15:00-07:00",
  },
  {
    id: 103,
    reporterId: 18,
    reporterName: "Amina Anka",
    category: ReportCategory.SOIL_EROSION,
    lga: "Anka",
    latitude: 12.1124,
    longitude: 6.0215,
    description: "Massive gully erosion has formed due to heavy runoffs and deforestation around mining waste dump zones. The soil top cover has completely lost its structure, impeding any natural vegetation regrowth.",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9d39d6618?auto=format&fit=crop&q=80&w=400",
    status: ReportStatus.VERIFIED,
    verifiedBy: 3,
    verifiedDate: "2026-07-04",
    officerRemarks: "Erosion catalogued. Recommended immediate Vetiver grass planting along gully margins to hold soil. Forwarding coordinates to Ministry of Environment.",
    createdAt: "2026-07-03T11:00:00-07:00",
  },
];

const INITIAL_PLANTINGS: TreePlanting[] = [
  {
    id: 1,
    userId: 12,
    userName: "Hassan Bello",
    species: TreeSpecies.NEEM,
    quantity: 120,
    lga: "Gusau",
    latitude: 12.1620,
    longitude: 6.6610,
    plantingDate: "2026-06-15",
    survivalRate: 92.5,
    notes: "Greening belt around public park buffer. Fenced with wire to secure from stray cattle.",
    createdAt: "2026-06-15T10:00:00-07:00",
  },
  {
    id: 2,
    userId: 14,
    userName: "Fatima Kaura",
    species: TreeSpecies.ACACIA,
    quantity: 250,
    lga: "Kaura Namoda",
    latitude: 12.8050,
    longitude: 6.6120,
    plantingDate: "2026-06-20",
    survivalRate: 85.0,
    notes: "Great Green Wall local corridor extension to secure against dune encroachment.",
    createdAt: "2026-06-20T08:30:00-07:00",
  },
  {
    id: 3,
    userId: 12,
    userName: "Hassan Bello",
    species: TreeSpecies.SHEA,
    quantity: 60,
    lga: "Maru",
    latitude: 11.9050,
    longitude: 5.7520,
    plantingDate: "2026-06-25",
    survivalRate: 95.0,
    notes: "Enclosed seed plots inside municipal reserve zone. High organic soil mulch applied.",
    createdAt: "2026-06-25T11:15:00-07:00",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"proposal" | "webgis" | "dashboard" | "database">("proposal");
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.REGISTERED_USER);
  const [reports, setReports] = useState<IncidentReport[]>(INITIAL_REPORTS);
  const [plantings, setPlantings] = useState<TreePlanting[]>(INITIAL_PLANTINGS);

  // Geo-Map state links
  const [selectedLga, setSelectedLga] = useState<string | null>(null);
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapSelectionMode, setMapSelectionMode] = useState(false);

  // 1. Submit citizen incident report callback
  const handleReportSubmit = (newReport: {
    category: ReportCategory;
    lga: "Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka";
    latitude: number;
    longitude: number;
    description: string;
    imageUrl?: string;
  }) => {
    const reportRecord: IncidentReport = {
      id: reports.length + 101,
      reporterId: 12, // Hassan Bello
      reporterName: "Hassan Bello",
      ...newReport,
      status: ReportStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    setReports([reportRecord, ...reports]);
    setTempCoords(null);
    setMapSelectionMode(false);
  };

  // 2. Submit tree seedling logging callback
  const handleLogTreePlanting = (newPlanting: {
    species: TreeSpecies;
    quantity: number;
    lga: "Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka";
    latitude: number;
    longitude: number;
    plantingDate: string;
    survivalRate: number;
    notes?: string;
  }) => {
    const plantingRecord: TreePlanting = {
      id: plantings.length + 1,
      userId: 12,
      userName: "Hassan Bello",
      ...newPlanting,
      createdAt: new Date().toISOString(),
    };
    setPlantings([plantingRecord, ...plantings]);
  };

  // 3. Officer verify report callback
  const handleVerifyReport = (reportId: number, status: ReportStatus, remarks: string) => {
    setReports(
      reports.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            officerRemarks: remarks,
            verifiedBy: 3, // Aliyu Mohammed
            verifiedDate: new Date().toISOString().split("T")[0],
          };
        }
        return r;
      })
    );
  };

  // Aggregates for statistics banner
  const verifiedCount = reports.filter((r) => r.status === ReportStatus.VERIFIED).length;
  const pendingCount = reports.filter((r) => r.status === ReportStatus.PENDING).length;
  const totalTreesPlanted = plantings.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F7F9F6] text-[#2D2D2D] font-sans overflow-hidden">
      {/* 1. Left Sidebar: Navigation & Branding (Natural Tones Sidebar) */}
      <aside className="w-full lg:w-64 bg-forest-700 flex flex-col shrink-0 text-white border-r border-forest-900">
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 shadow-inner">
              <Trees className="w-6 h-6 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight uppercase tracking-widest font-display">
                GreenWatch
              </h1>
              <p className="text-[10px] text-white/60 font-semibold font-mono tracking-wider">
                Zamfara State v1.0
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-4 flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab("proposal")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left border ${
              activeTab === "proposal"
                ? "bg-white/10 border-white/20 text-white font-semibold"
                : "bg-transparent border-transparent text-white/70 hover:bg-white/5 font-medium"
            }`}
          >
            <BookMarked className="w-4 h-4 shrink-0 text-emerald-300" />
            <span className="text-xs tracking-wide">Thesis Proposal</span>
          </button>

          <button
            onClick={() => setActiveTab("webgis")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left border ${
              activeTab === "webgis"
                ? "bg-white/10 border-white/20 text-white font-semibold"
                : "bg-transparent border-transparent text-white/70 hover:bg-white/5 font-medium"
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 text-emerald-300" />
            <span className="text-xs tracking-wide">Web-GIS Interactive Map</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left border ${
              activeTab === "dashboard"
                ? "bg-white/10 border-white/20 text-white font-semibold"
                : "bg-transparent border-transparent text-white/70 hover:bg-white/5 font-medium"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-300" />
            <span className="text-xs tracking-wide">Dashboards Hub</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left border ${
              activeTab === "database"
                ? "bg-white/10 border-white/20 text-white font-semibold"
                : "bg-transparent border-transparent text-white/70 hover:bg-white/5 font-medium"
            }`}
          >
            <Database className="w-4 h-4 shrink-0 text-emerald-300" />
            <span className="text-xs tracking-wide">Database & API Blueprint</span>
          </button>
        </nav>

        <div className="p-6">
          <div className="bg-earth-700 p-4 rounded-xl shadow-lg border border-earth-600">
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest font-mono">
              Reporting Portal
            </p>
            <p className="text-xs text-stone-200 mt-1.5 leading-relaxed">
              Help ZASEPA protect the Great Green Wall corridor.
            </p>
            <button
              onClick={() => {
                setActiveTab("webgis");
                setMapSelectionMode(true);
                setTempCoords(null);
              }}
              className="mt-3.5 w-full bg-white text-forest-700 hover:bg-stone-50 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              Submit Incident
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F7F9F6] lg:h-screen lg:overflow-y-auto">
        {/* Header (Top Nav alternative) */}
        <header className="h-16 bg-white border-b border-stone-200/80 flex items-center justify-between px-6 sm:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest hidden md:inline font-mono">
              Academic Final Year Project: System Design & analysis
            </span>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest md:hidden font-mono">
              Project: System Design
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-tighter font-mono">
                ZASEPA Server: Online
              </span>
            </div>
            <div className="flex items-center gap-3 border-l border-stone-200 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-stone-850">Dr. Aminu Lawal</p>
                <p className="text-[10px] text-stone-500 font-medium">Senior Field Officer</p>
              </div>
              <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center text-forest-700 font-bold text-xs shadow-xs">
                AL
              </div>
            </div>
          </div>
        </header>

        {/* State statistics Banner bar */}
        <section className="bg-earth-950 text-white py-3 px-6 sm:px-8 border-b border-earth-900 shadow-inner shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <p className="font-mono text-stone-300 text-[11px]">
                Active Supervision Sandbox: <strong className="text-white">Zamfara State LGAs online</strong>
              </p>
            </div>
            <div className="flex gap-6 font-mono text-[11px] text-stone-200">
              <div>
                Verified Alarms: <span className="text-red-400 font-bold">{verifiedCount}</span>
              </div>
              <div>
                Pending Validation: <span className="text-amber-400 font-bold">{pendingCount}</span>
              </div>
              <div>
                Total Trees Logged: <span className="text-emerald-400 font-bold">{totalTreesPlanted} seedlings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Body Tab Panels Rendering */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* ======================================================== */}
          {/* TAB 1: ACADEMIC PROPOSAL THESIS READER */}
          {/* ======================================================== */}
          {activeTab === "proposal" && (
            <div className="animate-fade-in">
              <ChapterReader />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: INTERACTIVE WEB-GIS WORKSPACE & REPORTER */}
          {/* ======================================================== */}
          {activeTab === "webgis" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fade-in">
              {/* GIS Map Column */}
              <div className="lg:col-span-7 flex flex-col">
                <InteractiveMap
                  reports={reports}
                  plantings={plantings}
                  selectedLga={selectedLga}
                  onLgaSelect={setSelectedLga}
                  interactiveSelection={mapSelectionMode}
                  onCoordinatesSelect={(lat, lng) => setTempCoords({ lat, lng })}
                />
              </div>

              {/* Incident reporter / contextual panel */}
              <div className="lg:col-span-5">
                <IncidentForm
                  onReportSubmit={handleReportSubmit}
                  selectedCoords={tempCoords}
                  onActivateMapSelection={() => {
                    setMapSelectionMode(true);
                    setTempCoords(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: USER & OFFICER WORKSPACE DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="animate-fade-in">
              <Dashboard
                reports={reports}
                plantings={plantings}
                currentRole={currentRole}
                onRoleChange={setCurrentRole}
                onLogTreePlanting={handleLogTreePlanting}
                onVerifyReport={handleVerifyReport}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: DATABASE SCHEMA & API SPEC SANDBOX */}
          {/* ======================================================== */}
          {activeTab === "database" && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white rounded-2xl border border-stone-200/80 p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] bg-earth-100 text-earth-800 font-bold px-2 py-0.5 rounded font-mono">
                    RELATIONAL BLUEPRINT (3NF)
                  </span>
                  <h3 className="font-display font-bold text-stone-900 text-base mt-1.5">
                    Normalized MySQL Schema & API Controller Specifications
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Engineered to prevent data insertion, update, and deletion anomalies. Access optimized DDL scripts and test API payloads below.
                  </p>
                </div>
              </div>

              <DatabaseSchema />
              <hr className="border-stone-200/60" />
              <APISandbox />
            </div>
          )}
        </main>

        {/* Academic Footer */}
        <footer className="bg-stone-900 text-stone-400 border-t border-stone-850 py-8 px-6 sm:px-8 mt-12 text-xs shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <p className="font-display font-semibold text-stone-200 text-sm">
                GreenWatch Zamfara — Thesis System Prototype
              </p>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                Final Year Project Proposal & GIS Design Architecture in partial fulfillment of the requirements for Bachelor of Science (B.Sc.) in Software Engineering.
              </p>
            </div>
            <div className="text-[11px] text-stone-500 font-mono">
              <p>© 2026. Academic Supervision Board. Developed with care.</p>
              <p className="mt-0.5">Approved for Publication-Grade Showcase.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
