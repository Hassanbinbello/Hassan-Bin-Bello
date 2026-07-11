/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { chapters } from "../data/chapters";
import {
  BookOpen,
  Search,
  Code,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Workflow,
  ArrowRight,
  Server,
  Layers,
  Eye
} from "lucide-react";

export default function ChapterReader() {
  const [activeChapterId, setActiveChapterId] = useState<string>("chapter1");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [viewDiagram, setViewDiagram] = useState<"usecase" | "sequence" | "activity" | "class" | "dfd" | "arch">("usecase");
  const [showRawMermaid, setShowRawMermaid] = useState(false);

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filter chapters based on search query
  const filteredChapters = chapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Diagrams source data mapping
  const diagrams = {
    usecase: {
      title: "Use Case Diagram",
      description: "Illustrates core boundaries and actor access permissions (Visitor, Citizen, Officer, Admin).",
      mermaid: `useCaseDiagram
    actor Visitor as "Visitor"
    actor RegisteredUser as "Registered User"
    actor Officer as "Environmental Officer (ZASEPA)"
    actor Admin as "System Administrator"

    Visitor --> (View Map & Stats)
    Visitor --> (Read Articles)
    Visitor --> (Register Account)

    RegisteredUser --> (Report Incident)
    RegisteredUser --> (Log Tree Planting)
    RegisteredUser --> (View Personal Dashboard)

    Officer --> (Verify Reports)
    Officer --> (Inspect Incident Coordinates)
    Officer --> (Log Survey Data)

    Admin --> (Manage Users & Roles)
    Admin --> (Publish Awareness Content)
    Admin --> (Inspect System Logs)`,
      render: (
        <div className="border border-stone-200/80 rounded-xl bg-stone-50/50 p-6 flex flex-col items-center justify-center space-y-6">
          <div className="flex gap-4 flex-wrap justify-center text-center">
            <div className="bg-white border border-stone-200 shadow-xs p-3 rounded-xl min-w-[120px]">
              <span className="font-bold text-xs block text-stone-800">Visitor</span>
              <div className="text-[10px] text-stone-500 mt-1 space-y-1">
                <div>• View Maps & Stats</div>
                <div>• Read Guidelines</div>
                <div>• Join Platform</div>
              </div>
            </div>
            <div className="bg-forest-50 border border-forest-200 shadow-xs p-3 rounded-xl min-w-[120px]">
              <span className="font-bold text-xs block text-forest-900">Citizen Reporter</span>
              <div className="text-[10px] text-stone-600 mt-1 space-y-1">
                <div>• File Deforestation</div>
                <div>• Log Seedlings</div>
                <div>• Monitor Streaks</div>
              </div>
            </div>
            <div className="bg-earth-50 border border-earth-200 shadow-xs p-3 rounded-xl min-w-[120px]">
              <span className="font-bold text-xs block text-earth-900">ZASEPA Officer</span>
              <div className="text-[10px] text-stone-600 mt-1 space-y-1">
                <div>• Review Alerts</div>
                <div>• Append Remarks</div>
                <div>• Approve Heatmaps</div>
              </div>
            </div>
            <div className="bg-stone-900 text-white border border-stone-800 shadow-xs p-3 rounded-xl min-w-[120px]">
              <span className="font-bold text-xs block text-stone-200">System Admin</span>
              <div className="text-[10px] text-stone-400 mt-1 space-y-1">
                <div>• Manage Roles</div>
                <div>• Publish Articles</div>
                <div>• Audit Access Logs</div>
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 transform rotate-90" />
          <div className="bg-white border border-forest-700/30 p-4 rounded-xl text-center max-w-sm shadow-xs">
            <span className="font-display font-semibold text-stone-900 text-xs block mb-1">
              GreenWatch Core Database
            </span>
            <span className="text-[10px] text-stone-500 block leading-relaxed">
              Provides unified security routing to ensure role limits. Visitors are restricted from filing reports, and Citizens are locked from verification.
            </span>
          </div>
        </div>
      ),
    },
    sequence: {
      title: "Sequence Diagram (Verification Workflow)",
      description: "Tracks chronological request-response lifecycles between Officer, Client UI, Controller, and DB.",
      mermaid: `sequenceDiagram
    autonumber
    actor Officer as Environmental Officer
    participant WebUI as Web Frontend (React)
    participant API as Backend Controller (Express)
    participant DB as Database (MySQL)
    participant Notify as Notification System

    Officer->>WebUI: Clicks "Verify" on Pending Report
    WebUI->>API: PUT /api/reports/:id/verify (JWT Token, Status, Remarks)
    activate API
    API->>API: Validate Token & Authorize Role (IsOfficer?)
    alt Role Authorized
        API->>DB: UPDATE reports SET status = 'Verified', officer_remarks = ?, verified_by = ? WHERE id = ?
        activate DB
        DB-->>API: Row Updated (OK)
        deactivate DB
        API->>Notify: DispatchVerificationNotice(ReporterId, Status)
        activate Notify
        Notify-->>API: Status Sent
        deactivate Notify
        API-->>WebUI: JSON Response (200 OK: Status Updated)
        WebUI-->>Officer: Render Verification Success State
    else Unauthorized
        API-->>WebUI: JSON Response (403 Forbidden)
        WebUI-->>Officer: Display Permission Error
    end
    deactivate API`,
      render: (
        <div className="border border-stone-200/80 rounded-xl bg-stone-50/50 p-6 flex flex-col space-y-4">
          <div className="bg-white rounded-xl border border-stone-100 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 font-mono">
              <span className="bg-forest-600 text-white rounded px-1 text-[10px]">1</span> 
              Officer sends Verify request via React UI
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 font-mono">
              <span className="bg-forest-600 text-white rounded px-1 text-[10px]">2</span> 
              Express REST API intercepts payload, validates JWT bearer token
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 font-mono">
              <span className="bg-forest-600 text-white rounded px-1 text-[10px]">3</span> 
              Role verified. System updates status to 'Verified' in MySQL reports table
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 font-mono">
              <span className="bg-forest-600 text-white rounded px-1 text-[10px]">4</span> 
              Status sends callback notification to Citizen reporter; map re-plots as verified
            </div>
          </div>
        </div>
      ),
    },
    activity: {
      title: "Activity Diagram (Seedling Verification)",
      description: "Logical transition tree from registration checks to active seedling carbon-offset mapping.",
      mermaid: `stateDiagram-v2
    [*] --> Start
    Start --> RegistrationForm : Navigate to Register
    RegistrationForm --> ValidateFields : Input Full Name, Email, Phone, LGA, Password
    ValidateFields --> CheckDB : Submit Form
    state CheckDB <<choice>>
    CheckDB --> RegistrationForm : Email Exists (Error)
    CheckDB --> SaveUser : Unique Email (Success)
    SaveUser --> AuthToken : Generate JWT
    AuthToken --> Dashboard : Load User Dashboard
    Dashboard --> PlantingForm : Click "Log Tree Planting"
    PlantingForm --> GetLocation : Select LGA, Species (Neem/Acacia), Qty
    GetLocation --> SubmitPlanting : Submit Logging
    SubmitPlanting --> WriteDB : Write to tree_planting Table
    WriteDB --> UpdateDashboard : Increment User Streak & Eco-Impact Count
    UpdateDashboard --> [*] : Terminate Session`,
      render: (
        <div className="border border-stone-200/80 rounded-xl bg-stone-50/50 p-6 flex justify-center">
          <div className="flex flex-col items-center space-y-3 text-xs w-full max-w-xs text-center font-mono font-semibold">
            <div className="bg-white border border-stone-200 p-2.5 rounded-lg w-full">Start User Registration</div>
            <div className="text-stone-400">↓</div>
            <div className="bg-white border border-stone-200 p-2.5 rounded-lg w-full">Validate unique email in DB</div>
            <div className="text-stone-400">↓</div>
            <div className="bg-forest-100 border border-forest-300 text-forest-900 p-2.5 rounded-lg w-full">Generate JWT security signature</div>
            <div className="text-stone-400">↓</div>
            <div className="bg-white border border-stone-200 p-2.5 rounded-lg w-full">Select LGA & tree species (Neem, Shea, Acacia)</div>
            <div className="text-stone-400">↓</div>
            <div className="bg-forest-700 text-white p-2.5 rounded-lg w-full">Write database logs & scale streak metric</div>
          </div>
        </div>
      ),
    },
    class: {
      title: "System Class Diagram",
      description: "Object-oriented structures displaying models, methods, properties, and encapsulation ranges.",
      mermaid: `classDiagram
    class User {
        +int id
        +string fullName
        +string email
        +string passwordHash
        +UserRole role
        +string phone
        +string lga
        +DateTime createdAt
        +register()
        +login()
    }

    class Report {
        +int id
        +int reporterId
        +ReportCategory category
        +string lga
        +double latitude
        +double longitude
        +string description
        +string imageUrl
        +ReportStatus status
        +int verifiedBy
        +string officerRemarks
        +DateTime createdAt
        +submit()
        +verify()
    }

    class TreePlanting {
        +int id
        +int userId
        +TreeSpecies species
        +int quantity
        +string lga
        +double latitude
        +double longitude
        +DateTime plantingDate
        +double survivalRate
        +logPlanting()
    }

    class SystemLog {
        +int id
        +int userId
        +string action
        +string ipAddress
        +string severity
        +DateTime timestamp
        +writeLog()
    }

    User "1" -- "0..*" Report : submits
    User "1" -- "0..*" TreePlanting : logs
    Report "0..*" -- "0..1" User : verified_by
    User "1" -- "0..*" SystemLog : triggers`,
      render: (
        <div className="border border-stone-200/80 rounded-xl bg-stone-50/50 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
            <div className="font-bold border-b border-stone-100 pb-1.5 mb-2 text-forest-700">Class: User</div>
            <div className="text-[10px] space-y-1 text-stone-600 mb-2">
              <div>+ id: int</div>
              <div>+ email: string</div>
              <div>+ role: UserRole</div>
              <div>+ lga: string</div>
            </div>
            <div className="border-t border-stone-100 pt-1.5 text-[10px] text-stone-500 italic">
              + register(), + login()
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
            <div className="font-bold border-b border-stone-100 pb-1.5 mb-2 text-forest-700">Class: Report</div>
            <div className="text-[10px] space-y-1 text-stone-600 mb-2">
              <div>+ id: int</div>
              <div>+ reporterId: int</div>
              <div>+ category: enum</div>
              <div>+ status: enum</div>
            </div>
            <div className="border-t border-stone-100 pt-1.5 text-[10px] text-stone-500 italic">
              + submit(), + verify()
            </div>
          </div>
        </div>
      ),
    },
    dfd: {
      title: "Data Flow Diagram (Level 1)",
      description: "Visualizes data flow through authentication, reporting, verification, and GIS rendering.",
      mermaid: `graph TD
    Citizen([Citizen Reporter]) --> |Auth Credentials| P1[1.0 User Authentication]
    P1 <--> |Read/Write Users| D1[(MySQL DB)]
    P1 --> |Auth Token| Citizen

    Citizen --> |Incident Payload + Image| P2[2.0 Incident Reporting]
    P2 --> |Save Report (Pending)| D2[(MySQL DB)]
    
    Officer([Environmental Officer]) --> |Inspect Jurisdiction| P3[3.0 Report Verification]
    D2 --> |Fetch Pending| P3
    P3 --> |Write Status & Remarks| D2
    
    Citizen --> |Planting Metrics| P4[4.0 Reforestation Tracker]
    P4 --> |Save Planting Logs| D3[(MySQL DB)]
    
    D2 & D3 --> |Aggregate Spatial Coordinates| P5[5.0 Web-GIS Visualization]
    P5 --> |Map Tiles & Heatmap Coordinates| WebUI[Frontend Map Canvas]
    WebUI --> Officer & Citizen`,
      render: (
        <div className="border border-stone-200/80 rounded-xl bg-stone-50/50 p-6 flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-[10px] font-mono">
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
              <span className="font-bold block text-stone-700 mb-1">Process 1.0</span>
              <span className="text-stone-500">Authenticate credentials, hash passwords, and sign JWT auth payload.</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
              <span className="font-bold block text-stone-700 mb-1">Process 2.0 / 3.0</span>
              <span className="text-stone-500">Log citizen incident payload. Fetch reports and append officer validation remarks.</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
              <span className="font-bold block text-stone-700 mb-1">Process 5.0</span>
              <span className="text-stone-500">Convert SQL Lat/Long coordinates into dynamic SVG hotspots.</span>
            </div>
          </div>
        </div>
      ),
    },
    arch: {
      title: "System Architecture (Client-Server)",
      description: "System diagram showing the flow between React UI, Leaflet, Express API, MySQL, and Cloudinary.",
      mermaid: `graph LR
    subgraph Presentation_Layer [Client Browser]
        React[React SPA UI]
        Leaflet[Leaflet.js Map Engine]
    end

    subgraph Application_Layer [Cloud Run Server]
        Express[Express REST API]
        Auth[JWT Middleware]
        Logger[System Logger]
    end

    subgraph Data_Layer [Infrastructure]
        MySQL[(MySQL Relational DB)]
        Cloudinary[Cloudinary CDN Storage]
    end

    React <--> |JSON Requests / JWT| Express
    Leaflet <--> |OpenStreetMap Vector Tiles| OSM[OSM Tile Servers]
    Express --> |Authenticate| Auth
    Express --> |Query / Update| MySQL
    Express --> |Upload Photos| Cloudinary
    Auth --> |Log Action| Logger
    Logger --> MySQL`,
      render: (
        <div className="border border-stone-200/80 rounded-xl bg-stone-50/50 p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch gap-3 text-center text-xs font-semibold">
            <div className="bg-white border border-stone-200 rounded-xl p-3 flex-1 flex flex-col justify-between">
              <div className="font-mono text-[9px] text-stone-400">PRESENTATION</div>
              <span className="text-stone-800 block mt-1">React SPA + Leaflet Vector Tiles</span>
            </div>
            <div className="bg-forest-50 border border-forest-200 text-forest-900 rounded-xl p-3 flex-1 flex flex-col justify-between">
              <div className="font-mono text-[9px] text-stone-400">CONTROLLER</div>
              <span className="block mt-1">Node/Express REST API + Auth Guards</span>
            </div>
            <div className="bg-stone-900 text-white border border-stone-800 rounded-xl p-3 flex-1 flex flex-col justify-between">
              <div className="font-mono text-[9px] text-stone-500">STORAGE LAYER</div>
              <span className="text-stone-300 block mt-1">MySQL Normalized tables + Cloudinary CDN</span>
            </div>
          </div>
        </div>
      ),
    },
  };

  const activeDiagram = diagrams[viewDiagram];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sidebar Table of Contents / Search */}
      <div className="lg:col-span-4 space-y-4">
        {/* Search Input bar */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters or design criteria..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50/30 pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
            />
          </div>
        </div>

        {/* Chapters list navigation */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 space-y-1">
          <h4 className="font-display font-semibold text-stone-900 text-xs px-2 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-forest-700" />
            Proposal Document Chapters
          </h4>

          {filteredChapters.length === 0 ? (
            <p className="text-[11px] text-stone-500 px-2 py-3 text-center">No matching chapters found.</p>
          ) : (
            filteredChapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setActiveChapterId(chapter.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  chapter.id === activeChapterId
                    ? "border-forest-700 bg-forest-50/50 text-forest-900 shadow-xs"
                    : "border-stone-100 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span>{chapter.title}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            ))
          )}
        </div>

        {/* Diagrams selection shortcut */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 space-y-2">
          <h4 className="font-display font-semibold text-stone-900 text-xs px-2 flex items-center gap-1.5">
            <Workflow className="w-4 h-4 text-earth-700" />
            System Modeling Diagrams
          </h4>
          <p className="text-[11px] text-stone-500 leading-relaxed px-2">
            Select a specific architectural layout to display its interactive modeling schematic and copy its raw Mermaid syntax.
          </p>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
            {Object.entries(diagrams).map(([key, value]) => {
              const isActive = viewDiagram === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setViewDiagram(key as any);
                    setActiveChapterId("chapter3"); // scroll to chapter 3 where modeling resides
                  }}
                  className={`px-2 py-1.5 rounded-lg border text-left transition-all ${
                    isActive
                      ? "bg-earth-50 text-earth-900 border-earth-300 ring-1 ring-earth-300"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {value.title.split(" (")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chapter text reader */}
      <div className="lg:col-span-8 space-y-6">
        {/* Render Chapters Markdown Text */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-8 leading-relaxed prose prose-stone max-w-none">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-forest-700 animate-pulse" />
            <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">
              PUBLICATION GRADE RESEARCH PROPOSAL
            </span>
          </div>

          <div className="space-y-6">
            {/* Split and render Chapter text manually to inject clean CSS classes and Mermaid diagram elements */}
            {activeChapter.content.split("\n\n").map((para, i) => {
              // Handle headers
              if (para.startsWith("# ")) {
                return (
                  <h1
                    key={i}
                    className="font-display font-bold text-stone-900 text-2xl tracking-tight border-b border-stone-100 pb-4"
                  >
                    {para.replace("# ", "")}
                  </h1>
                );
              }
              if (para.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-display font-semibold text-stone-950 text-lg mt-8 mb-4 tracking-tight">
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              if (para.startsWith("### ")) {
                return (
                  <h3 key={i} className="font-display font-semibold text-stone-900 text-sm mt-6 mb-3">
                    {para.replace("### ", "")}
                  </h3>
                );
              }

              // Handle list bullets
              if (para.startsWith("* ") || para.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-5 text-stone-600 text-xs space-y-2 my-4">
                    {para.split("\n").map((line, li) => (
                      <li key={li}>{line.replace(/^[\*\-]\s+/, "")}</li>
                    ))}
                  </ul>
                );
              }

              // Handle numbered lists
              if (/^\d+\.\s+/.test(para)) {
                return (
                  <ol key={i} className="list-decimal pl-5 text-stone-600 text-xs space-y-2.5 my-4">
                    {para.split("\n").map((line, li) => (
                      <li key={li}>{line.replace(/^\d+\.\s+/, "")}</li>
                    ))}
                  </ol>
                );
              }

              // Handle tables (comparisons and REST specs)
              if (para.includes("|") && para.includes("---")) {
                const rows = para.split("\n").filter((r) => r.trim() !== "");
                const headers = rows[0]
                  .split("|")
                  .map((h) => h.trim())
                  .filter((h) => h !== "");
                const bodyRows = rows.slice(2);

                return (
                  <div key={i} className="overflow-x-auto my-6 rounded-xl border border-stone-100 shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-100 text-stone-800 font-display font-semibold border-b border-stone-200">
                          {headers.map((h, hi) => (
                            <th key={hi} className="p-3.5">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {bodyRows.map((row, ri) => {
                          const cols = row
                            .split("|")
                            .map((c) => c.trim())
                            .filter((c) => c !== "");
                          return (
                            <tr key={ri} className="hover:bg-stone-50/50">
                              {cols.map((col, ci) => (
                                <td key={ci} className="p-3.5 text-stone-600 leading-relaxed">
                                  {col}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // Handle Mermaid diagrams rendering section
              if (para.includes("```mermaid")) {
                return (
                  <div key={i} className="my-6 space-y-3">
                    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 space-y-4">
                      {/* Diagram controller */}
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-earth-300" />
                          <span className="font-display font-medium text-stone-200 text-xs">
                            {activeDiagram.title} (System Modeling Canvas)
                          </span>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <button
                            onClick={() => setShowRawMermaid(false)}
                            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                              !showRawMermaid
                                ? "bg-stone-800 text-white border-stone-700"
                                : "bg-stone-950 text-stone-500 border-stone-800 hover:text-stone-300"
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            Visual Model
                          </button>
                          <button
                            onClick={() => setShowRawMermaid(true)}
                            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                              showRawMermaid
                                ? "bg-stone-800 text-white border-stone-700"
                                : "bg-stone-950 text-stone-500 border-stone-800 hover:text-stone-300"
                            }`}
                          >
                            <Code className="w-3 h-3" />
                            Mermaid Code
                          </button>
                        </div>
                      </div>

                      {/* Display visual custom chart or raw copyable code terminal */}
                      {!showRawMermaid ? (
                        <div className="bg-white rounded-xl p-2.5 overflow-hidden">
                          {activeDiagram.render}
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => handleCopyCode(viewDiagram, activeDiagram.mermaid)}
                            className="absolute top-2 right-2 bg-stone-850 hover:bg-stone-800 text-stone-400 p-1.5 rounded-md border border-stone-800 transition-all"
                          >
                            {copiedCodeId === viewDiagram ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <pre className="p-4 rounded-xl bg-stone-950 overflow-x-auto text-emerald-400 font-mono text-[10px] leading-relaxed select-all max-h-[220px]">
                            {activeDiagram.mermaid}
                          </pre>
                        </div>
                      )}

                      <p className="text-[11px] text-stone-400 leading-normal">
                        <strong>Inspector Note:</strong> {activeDiagram.description} The complete, syntactically clean Mermaid code block is ready to paste directly into academic compilers.
                      </p>
                    </div>
                  </div>
                );
              }

              // Standard body paragraphs
              return (
                <p key={i} className="text-stone-600 text-xs mt-3 leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
