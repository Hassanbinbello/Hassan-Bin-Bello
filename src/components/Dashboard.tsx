/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Trees,
  Flame,
  User,
  ShieldCheck,
  Plus,
  Compass,
  AlertCircle,
  FileCheck2,
  Calendar,
  Layers,
  Heart,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";
import { UserRole, IncidentReport, TreePlanting, ReportStatus, TreeSpecies } from "../types";

interface DashboardProps {
  reports: IncidentReport[];
  plantings: TreePlanting[];
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onVerifyReport: (reportId: number, status: ReportStatus, remarks: string) => void;
  onLogTreePlanting: (planting: {
    species: TreeSpecies;
    quantity: number;
    lga: "Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka";
    latitude: number;
    longitude: number;
    plantingDate: string;
    survivalRate: number;
    notes?: string;
  }) => void;
}

export default function Dashboard({
  reports,
  plantings,
  currentRole,
  onRoleChange,
  onVerifyReport,
  onLogTreePlanting,
}: DashboardProps) {
  // Tree Planting log inputs
  const [species, setSpecies] = useState<TreeSpecies>(TreeSpecies.NEEM);
  const [quantity, setQuantity] = useState(10);
  const [plantingLga, setPlantingLga] = useState<"Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka">("Maru");
  const [survivalRate, setSurvivalRate] = useState(100);
  const [notes, setNotes] = useState("");
  const [showLogPlantingForm, setShowLogPlantingForm] = useState(false);
  const [treeSuccessMsg, setTreeSuccessMsg] = useState(false);

  // Active report being reviewed by Environmental Officer
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState("");

  const handleTreeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      alert("Please enter a valid tree quantity greater than zero.");
      return;
    }

    // Simulate coordinates based on selected LGA
    let lat = 12.162;
    let lng = 6.661;
    switch (plantingLga) {
      case "Gusau": lat = 12.162 + (Math.random() - 0.5) * 0.04; lng = 6.661 + (Math.random() - 0.5) * 0.04; break;
      case "Maru": lat = 11.9 + (Math.random() - 0.5) * 0.08; lng = 5.8 + (Math.random() - 0.5) * 0.08; break;
      case "Talata Mafara": lat = 12.55 + (Math.random() - 0.5) * 0.04; lng = 6.05 + (Math.random() - 0.5) * 0.04; break;
      case "Kaura Namoda": lat = 12.8 + (Math.random() - 0.5) * 0.04; lng = 6.6 + (Math.random() - 0.5) * 0.04; break;
      case "Anka": lat = 12.1 + (Math.random() - 0.5) * 0.06; lng = 6.0 + (Math.random() - 0.5) * 0.06; break;
    }

    onLogTreePlanting({
      species,
      quantity,
      lga: plantingLga,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      plantingDate: new Date().toISOString().split("T")[0],
      survivalRate,
      notes,
    });

    setTreeSuccessMsg(true);
    setNotes("");
    setTimeout(() => {
      setTreeSuccessMsg(false);
      setShowLogPlantingForm(false);
    }, 2000);
  };

  const handleReviewSubmit = (status: ReportStatus) => {
    if (!activeReviewId) return;
    if (!officerRemarks.trim()) {
      alert("Please provide the inspector's validation remarks before updating status.");
      return;
    }
    onVerifyReport(activeReviewId, status, officerRemarks);
    setActiveReviewId(null);
    setOfficerRemarks("");
  };

  return (
    <div className="space-y-6">
      {/* Role Switcher Academic bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        <div>
          <span className="bg-forest-600 text-white text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md font-semibold">
            Prototype Sandbox Clearance
          </span>
          <h4 className="font-display font-medium text-stone-100 text-sm mt-1">
            Toggle user identities to test full-stack reporting & verification flows
          </h4>
        </div>
        <div className="flex gap-2 bg-stone-800 p-1 rounded-xl">
          <button
            onClick={() => onRoleChange(UserRole.REGISTERED_USER)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRole === UserRole.REGISTERED_USER
                ? "bg-forest-700 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Citizen Forester
          </button>
          <button
            onClick={() => onRoleChange(UserRole.ENVIRONMENTAL_OFFICER)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRole === UserRole.ENVIRONMENTAL_OFFICER
                ? "bg-earth-700 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            ZASEPA Officer
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. CITIZEN FORESTER DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === UserRole.REGISTERED_USER && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Citizen stats and Log Tree Planting panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Impact Cards */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-forest-700 flex items-center justify-center font-bold">
                  HB
                </div>
                <div>
                  <h4 className="font-display font-bold text-stone-900 text-sm">Hassan Bello</h4>
                  <p className="text-[10px] text-stone-400 font-mono">GUSAU SECTOR CIVIC REPORTER</p>
                </div>
              </div>

              <hr className="border-stone-100" />

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                  <span className="block text-[10px] font-mono text-stone-400 uppercase">My Reports</span>
                  <span className="font-display font-bold text-stone-800 text-lg">3 logged</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                  <span className="block text-[10px] font-mono text-stone-400 uppercase">Seedlings</span>
                  <span className="font-display font-bold text-stone-800 text-lg">
                    {plantings.reduce((sum, p) => sum + p.quantity, 0)} planted
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 flex items-center gap-2.5">
                <Award className="w-5 h-5 text-forest-700 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-forest-900 block">Eco-Warrior Status</span>
                  <span className="text-stone-500">Your trees have captured approx. 120kg CO2/year!</span>
                </div>
              </div>
            </div>

            {/* Tree Planting logger trigger */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5">
              {!showLogPlantingForm ? (
                <div className="text-center py-4">
                  <Trees className="w-8 h-8 text-forest-600 mx-auto mb-2" />
                  <h5 className="font-display font-semibold text-stone-800 text-xs">Participate in Reforestation</h5>
                  <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto mb-4">
                    Have you planted a Neem tree or an Acacia seedling recently? Geotag your planting to verify survival
                    success rates.
                  </p>
                  <button
                    onClick={() => setShowLogPlantingForm(true)}
                    className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 mx-auto transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Geotag Tree Seedling
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTreeSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-display font-semibold text-stone-800 text-xs">Geotag Seedling Planting</h5>
                    <button
                      type="button"
                      onClick={() => setShowLogPlantingForm(false)}
                      className="text-stone-400 hover:text-stone-600 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>

                  {treeSuccessMsg && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-forest-800 text-xs font-medium flex items-center gap-1.5 animate-pulse">
                      <CheckCircle className="w-4 h-4" />
                      Seedling Coordinates Logged!
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1">
                      Botanical Species
                    </label>
                    <select
                      value={species}
                      onChange={(e) => setSpecies(e.target.value as TreeSpecies)}
                      className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-2.5 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
                    >
                      {Object.values(TreeSpecies).map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1">
                        LGA Location
                      </label>
                      <select
                        value={plantingLga}
                        onChange={(e) => setPlantingLga(e.target.value as any)}
                        className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
                      >
                        <option value="Gusau">Gusau</option>
                        <option value="Maru">Maru</option>
                        <option value="Talata Mafara">Talata Mafara</option>
                        <option value="Kaura Namoda">Kaura Namoda</option>
                        <option value="Anka">Anka</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1">
                      Initial Survival Assessment ({survivalRate}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={survivalRate}
                      onChange={(e) => setSurvivalRate(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-forest-700"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                      <span>10% Low</span>
                      <span>100% Full survival</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1">
                      Planting Notes / Context
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Planted near community primary school, fenced to prevent goat grazing..."
                      className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-2.5 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
                      rows={2}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-forest-700 hover:bg-forest-800 text-white py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
                  >
                    Commit Seedling Records
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Citizen's report history list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-5 h-5 text-forest-700" />
                  <h4 className="font-display font-semibold text-stone-900 text-sm">
                    My Environmental Activity Ledger
                  </h4>
                </div>
                <span className="text-[10px] text-stone-400 font-mono uppercase">
                  SORT: RECENT
                </span>
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <FileCheck2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">You haven't filed any ecological reports yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {reports.map((report) => {
                    const statusColors = {
                      [ReportStatus.PENDING]: "bg-amber-50 text-amber-800 border-amber-200",
                      [ReportStatus.VERIFIED]: "bg-emerald-50 text-emerald-800 border-emerald-200",
                      [ReportStatus.REJECTED]: "bg-rose-50 text-rose-800 border-rose-200",
                      [ReportStatus.RESOLVED]: "bg-blue-50 text-blue-800 border-blue-200",
                    };

                    return (
                      <div
                        key={report.id}
                        className="p-4 rounded-xl border border-stone-100 bg-stone-50/30 space-y-3 hover:border-stone-200 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="bg-stone-200 text-stone-700 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md">
                              INC-{report.id}
                            </span>
                            <h5 className="font-display font-bold text-stone-800 text-xs mt-1.5">
                              {report.category}
                            </h5>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                              statusColors[report.status]
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed">{report.description}</p>

                        <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5" />
                            LGA: {report.lga}
                          </span>
                          <span>|</span>
                          <span>Lat: {report.latitude.toFixed(4)}, Lng: {report.longitude.toFixed(4)}</span>
                        </div>

                        {/* Verification details if updated */}
                        {report.status !== ReportStatus.PENDING && report.officerRemarks && (
                          <div className="p-3 bg-white rounded-xl border border-stone-100/80 text-xs text-stone-600 mt-2">
                            <span className="font-semibold text-stone-800 flex items-center gap-1 mb-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-earth-700" />
                              ZASEPA Officer Verification Remarks:
                            </span>
                            "{report.officerRemarks}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ZASEPA ENVIRONMENTAL OFFICER DASHBOARD VIEW */}
      {/* ======================================================== */}
      {currentRole === UserRole.ENVIRONMENTAL_OFFICER && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Jurisdiction stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-earth-700 flex items-center justify-center font-bold">
                  AM
                </div>
                <div>
                  <h4 className="font-display font-bold text-stone-900 text-sm">Aliyu Mohammed</h4>
                  <p className="text-[10px] text-stone-400 font-mono">ZASEPA SENIOR AREA INSPECTOR</p>
                </div>
              </div>

              <hr className="border-stone-100" />

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-2">
                  My Active Jurisdiction
                </span>
                <span className="text-xs font-semibold text-stone-800 block">
                  Maru, Anka & Talata Mafara Sectors
                </span>
                <p className="text-[10px] text-stone-500 mt-1">
                  Assigned by the State Ministry of Environment to oversee forestry exploitation warnings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-100 text-center">
                  <span className="block text-[9px] font-mono text-stone-400 uppercase">Pending Review</span>
                  <span className="font-display font-bold text-amber-800 text-lg">
                    {reports.filter((r) => r.status === ReportStatus.PENDING).length} alerts
                  </span>
                </div>
                <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[9px] font-mono text-stone-400 uppercase">Verified Actions</span>
                  <span className="font-display font-bold text-emerald-800 text-lg">
                    {reports.filter((r) => r.status === ReportStatus.VERIFIED).length} logged
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pending Reports Verification Interface */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <ShieldCheck className="w-5 h-5 text-earth-700" />
                <h4 className="font-display font-semibold text-stone-900 text-sm">
                  Citizen Environmental Violation Verification Queue
                </h4>
              </div>

              {reports.filter((r) => r.status === ReportStatus.PENDING).length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-xl bg-stone-50/30">
                  <FileCheck2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-700">Verification Queue Clear!</p>
                  <p className="text-[11px] text-stone-500 mt-1">All submitted citizen crowdsourcing alerts have been fully processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports
                    .filter((r) => r.status === ReportStatus.PENDING)
                    .map((report) => {
                      const isReviewing = activeReviewId === report.id;

                      return (
                        <div
                          key={report.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isReviewing ? "border-earth-400 bg-earth-50/10 shadow-sm" : "border-stone-100 hover:border-stone-200"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                                  PENDING REVIEW
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">INC-{report.id}</span>
                              </div>
                              <h5 className="font-display font-bold text-stone-800 text-xs mt-1.5">
                                {report.category} — {report.lga} LGA
                              </h5>
                            </div>
                            <button
                              onClick={() => {
                                if (isReviewing) {
                                  setActiveReviewId(null);
                                } else {
                                  setActiveReviewId(report.id);
                                  setOfficerRemarks("");
                                }
                              }}
                              className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-stone-800 transition-all self-start"
                            >
                              {isReviewing ? "Minimize Review" : "Inspect & Verify"}
                            </button>
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed mt-2.5">{report.description}</p>

                          <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono mt-2">
                            <span>Reporter: {report.reporterName}</span>
                            <span>|</span>
                            <span>Lat: {report.latitude.toFixed(4)}, Lng: {report.longitude.toFixed(4)}</span>
                          </div>

                          {/* Dynamic expanded officer verification panel */}
                          {isReviewing && (
                            <div className="mt-4 p-4 rounded-xl bg-white border border-stone-200/60 space-y-3 animate-fade-in">
                              <div className="flex items-start gap-3">
                                {report.imageUrl && (
                                  <div className="flex-shrink-0">
                                    <span className="block text-[9px] font-mono text-stone-400 uppercase mb-1">
                                      Attached Evidence
                                    </span>
                                    <img
                                      src={report.imageUrl}
                                      alt="evidence"
                                      className="w-24 h-24 rounded-lg object-cover border border-stone-200 shadow-sm"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                                    Official Inspector Verification Remarks
                                  </label>
                                  <textarea
                                    value={officerRemarks}
                                    onChange={(e) => setOfficerRemarks(e.target.value)}
                                    placeholder="Append physical verification details, tree damage assessment, or regulatory actions triggered..."
                                    className="w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-earth-700"
                                    rows={3}
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleReviewSubmit(ReportStatus.REJECTED)}
                                  className="px-3 py-1.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-semibold rounded-lg transition-all"
                                >
                                  Decline (Flag Spurious)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReviewSubmit(ReportStatus.VERIFIED)}
                                  className="px-3.5 py-1.5 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-lg transition-all"
                                >
                                  Approve & Geotag Heatmap
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
