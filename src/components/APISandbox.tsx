/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Terminal, Send, Server, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT";
  path: string;
  description: string;
  requestBody: string;
  successResponse: string;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "POST",
    path: "/api/auth/register",
    description: "Registers a new citizen user or officer in the Zamfara database.",
    requestBody: JSON.stringify({
      email: "hassan.bello@example.ng",
      password: "StrongPassword123#",
      fullName: "Hassan Bello",
      phone: "+2348031234567",
      lga: "Gusau"
    }, null, 2),
    successResponse: JSON.stringify({
      success: true,
      message: "User account created successfully inside MySQL.",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsInJvbGUiOiJSZWdpc3RlcmVkIFVzZXIifQ...",
      role: "Registered User"
    }, null, 2),
  },
  {
    method: "POST",
    path: "/api/auth/login",
    description: "Authenticates credentials and issues a secure 24-hour expiration JWT.",
    requestBody: JSON.stringify({
      email: "aliyu.inspector@zasepa.gov.ng",
      password: "OfficerSecureSecure!"
    }, null, 2),
    successResponse: JSON.stringify({
      success: true,
      message: "Authentication successful. Access granted.",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6IkVudmlyb25tZW50YWwgT2ZmaWNlciJ9...",
      role: "Environmental Officer",
      fullName: "Aliyu Mohammed"
    }, null, 2),
  },
  {
    method: "POST",
    path: "/api/reports",
    description: "Submits a new citizen incident report. Triggers coordinate validation checks.",
    requestBody: JSON.stringify({
      category: "Illegal Logging",
      lga: "Maru",
      latitude: 12.1833,
      longitude: 6.2500,
      description: "Discovered several active timber felling operations inside Maru reserve forest. Shea tree trunk remnants are scattered.",
      imageUrl: "https://res.cloudinary.com/greenwatch/image/upload/logging_incident_maru.jpg"
    }, null, 2),
    successResponse: JSON.stringify({
      success: true,
      message: "Environmental incident report logged successfully.",
      report: {
        id: 104,
        reporterId: 12,
        category: "Illegal Logging",
        lga: "Maru",
        latitude: 12.18330000,
        longitude: 6.25000000,
        description: "Discovered several active timber felling operations inside Maru...",
        imageUrl: "https://res.cloudinary.com/greenwatch/image/upload/logging_incident_maru.jpg",
        status: "Pending",
        verifiedBy: null,
        officerRemarks: null,
        createdAt: "2026-07-06T09:20:15Z"
      }
    }, null, 2),
  },
  {
    method: "PUT",
    path: "/api/reports/104/verify",
    description: "Allows ZASEPA environmental officers to verify or reject citizen reports (Officer clearance required).",
    requestBody: JSON.stringify({
      status: "Verified",
      officerRemarks: "Confirmed on-site logging activity. Dispatched the Maru local rangers to seize the remaining logs."
    }, null, 2),
    successResponse: JSON.stringify({
      success: true,
      message: "Report verification status locked. Heatmap coordinate weights updated.",
      verifiedReport: {
        id: 104,
        status: "Verified",
        verifiedBy: 3,
        officerRemarks: "Confirmed on-site logging activity. Dispatched the Maru local rangers...",
        verifiedAt: "2026-07-06T11:45:00Z"
      }
    }, null, 2),
  },
  {
    method: "POST",
    path: "/api/tree-planting",
    description: "Logs a seedling planting event, including survival rate percentages and soil parameters.",
    requestBody: JSON.stringify({
      species: "Neem (Dongoyaro)",
      quantity: 50,
      lga: "Kaura Namoda",
      latitude: 12.8021,
      longitude: 6.6112,
      plantingDate: "2026-07-05",
      survivalRate: 95.00,
      notes: "Community youth-led green wall planting belt."
    }, null, 2),
    successResponse: JSON.stringify({
      success: true,
      message: "Tree seedling coordinates logged inside the reforestation database.",
      planting: {
        id: 72,
        userId: 12,
        species: "Neem (Dongoyaro)",
        quantity: 50,
        lga: "Kaura Namoda",
        latitude: 12.80210000,
        longitude: 6.61120000,
        survivalRate: 95.00,
        createdAt: "2026-07-06T02:15:00Z"
      }
    }, null, 2),
  },
  {
    method: "GET",
    path: "/api/admin/stats",
    description: "Computes aggregates, survival rate means, and active threat alarms. (Admin/Officer access).",
    requestBody: "{}",
    successResponse: JSON.stringify({
      success: true,
      statistics: {
        totalReports: 142,
        verifiedReports: 89,
        pendingReports: 53,
        totalTreesPlanted: 12450,
        meanSurvivalRate: "88.42%",
        mostActiveLga: "Maru",
        warningIndexByLga: {
          Gusau: "Low",
          Maru: "Critical",
          "Talata Mafara": "Medium",
          "Kaura Namoda": "High",
          Anka: "High"
        }
      }
    }, null, 2),
  },
];

export default function APISandbox() {
  const [activeIndex, setActiveIndex] = useState(2); // default /api/reports POST
  const [terminalOutput, setTerminalOutput] = useState<string>("// Terminal idle. Select an endpoint and click Send to test...");
  const [isSending, setIsSending] = useState(false);
  const [customBody, setCustomBody] = useState(API_ENDPOINTS[2].requestBody);

  const endpoint = API_ENDPOINTS[activeIndex];

  const handleSelectEndpoint = (index: number) => {
    setActiveIndex(index);
    setCustomBody(API_ENDPOINTS[index].requestBody);
    setTerminalOutput("// Terminal idle. Click Send Simulated Request to compile...");
  };

  const handleSendRequest = () => {
    setIsSending(true);
    setTerminalOutput(`$ curl -X ${endpoint.method} ${endpoint.path} \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn..." \\\n  -d '${customBody.replace(/\n/g, "")}'`);

    setTimeout(() => {
      setTerminalOutput((prev) => {
        return `${prev}\n\nHTTP/1.1 200 OK\nContent-Type: application/json\nConnection: keep-alive\n\n${endpoint.successResponse}`;
      });
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* List of endpoints */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-forest-700" />
          <h4 className="font-display font-semibold text-stone-900 text-sm">
            RESTful API Specifications
          </h4>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          The GreenWatch Zamfara backend exposes modular, token-secured endpoints. Underneath the API tables, select an endpoint to run in the sandbox terminal.
        </p>

        <div className="space-y-2">
          {API_ENDPOINTS.map((ep, i) => {
            const isActive = i === activeIndex;
            const methodColors = {
              GET: "bg-blue-50 text-blue-800 border-blue-200",
              POST: "bg-emerald-50 text-emerald-800 border-emerald-200",
              PUT: "bg-amber-50 text-amber-800 border-amber-200",
            };

            return (
              <button
                key={ep.path}
                onClick={() => handleSelectEndpoint(i)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  isActive ? "border-forest-700 bg-forest-50/20 shadow-xs" : "border-stone-100 bg-white hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[9px] border ${methodColors[ep.method]}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono font-semibold text-stone-800 tracking-tight">{ep.path}</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">{ep.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive terminal and editable request body */}
      <div className="lg:col-span-7 space-y-6">
        {/* Request payload editor */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-stone-900 text-xs">
              JSON Request Body (Editable Payload)
            </h4>
            <span className="text-[10px] text-stone-400 font-mono">Content-Type: application/json</span>
          </div>

          <textarea
            value={customBody}
            onChange={(e) => setCustomBody(e.target.value)}
            className="w-full h-[120px] rounded-xl border border-stone-200 bg-stone-50 p-3 font-mono text-[11px] text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:bg-white"
            disabled={endpoint.method === "GET" && endpoint.requestBody === "{}"}
          />

          <button
            onClick={handleSendRequest}
            disabled={isSending}
            className="w-full bg-forest-700 hover:bg-forest-800 text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Compiling Node API Response...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Send Simulated Request to Express Backend
              </>
            )}
          </button>
        </div>

        {/* API response terminal */}
        <div className="bg-stone-950 rounded-2xl border border-stone-900 overflow-hidden shadow-md flex flex-col">
          <div className="p-3 bg-stone-900 border-b border-stone-950 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="font-mono text-[11px] text-stone-300">Terminal Sandbox Response</span>
          </div>
          <div className="p-4 overflow-y-auto h-[180px] font-mono text-[11px] text-stone-300 leading-relaxed scrollbar-thin">
            <pre className="text-emerald-400 whitespace-pre-wrap">{terminalOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
