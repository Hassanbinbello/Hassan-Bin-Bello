/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Upload, MapPin, CheckCircle, Navigation, AlertTriangle, Sparkles } from "lucide-react";
import { ReportCategory } from "../types";

interface IncidentFormProps {
  onReportSubmit: (report: {
    category: ReportCategory;
    lga: "Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka";
    latitude: number;
    longitude: number;
    description: string;
    imageUrl?: string;
  }) => void;
  selectedCoords: { lat: number; lng: number } | null;
  onActivateMapSelection: () => void;
}

// Simulated default images for high-fidelity illustration based on category
const MOCK_IMAGES: Record<ReportCategory, string> = {
  [ReportCategory.ILLEGAL_LOGGING]: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=400", // logs
  [ReportCategory.BUSH_BURNING]: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400", // burning forest
  [ReportCategory.DESERT_ENCROACHMENT]: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&q=80&w=400", // desert sand
  [ReportCategory.UNREGULATED_AGRICULTURE]: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400", // farmland clearing
  [ReportCategory.SOIL_EROSION]: "https://images.unsplash.com/photo-1532187863486-abf9d39d6618?auto=format&fit=crop&q=80&w=400", // eroded soil
};

export default function IncidentForm({
  onReportSubmit,
  selectedCoords,
  onActivateMapSelection,
}: IncidentFormProps) {
  const [category, setCategory] = useState<ReportCategory>(ReportCategory.ILLEGAL_LOGGING);
  const [lga, setLga] = useState<"Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka">("Maru");
  const [description, setDescription] = useState("");
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Manual lat/lng inputs when not using map selection
  const [manualLat, setManualLat] = useState("12.1833");
  const [manualLng, setManualLng] = useState("6.2500");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto GPS Coordinates capture simulation
  const handleGpsCapture = () => {
    setIsCapturingGps(true);
    // Simulate mobile GPS ping targeting a coordinate within selected LGA
    setTimeout(() => {
      let lat = 12.162;
      let lng = 6.661;

      switch (lga) {
        case "Gusau":
          lat = 12.162 + (Math.random() - 0.5) * 0.05;
          lng = 6.661 + (Math.random() - 0.5) * 0.05;
          break;
        case "Maru":
          lat = 11.9 + (Math.random() - 0.5) * 0.1;
          lng = 5.8 + (Math.random() - 0.5) * 0.1;
          break;
        case "Talata Mafara":
          lat = 12.55 + (Math.random() - 0.5) * 0.05;
          lng = 6.05 + (Math.random() - 0.5) * 0.05;
          break;
        case "Kaura Namoda":
          lat = 12.8 + (Math.random() - 0.5) * 0.05;
          lng = 6.6 + (Math.random() - 0.5) * 0.05;
          break;
        case "Anka":
          lat = 12.1 + (Math.random() - 0.5) * 0.08;
          lng = 6.0 + (Math.random() - 0.5) * 0.08;
          break;
      }

      setManualLat(lat.toFixed(6));
      setManualLng(lng.toFixed(6));
      setIsCapturingGps(false);
    }, 1200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lat = selectedCoords ? selectedCoords.lat : parseFloat(manualLat);
    const lng = selectedCoords ? selectedCoords.lng : parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please provide valid coordinates.");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the incident details.");
      return;
    }

    // Pass up to parent container
    onReportSubmit({
      category,
      lga,
      latitude: lat,
      longitude: lng,
      description,
      imageUrl: filePreview || MOCK_IMAGES[category],
    });

    setSubmissionSuccess(true);
    setTimeout(() => {
      // Clear inputs
      setDescription("");
      setSelectedFile(null);
      setFilePreview(null);
      setSubmissionSuccess(false);
    }, 3000);
  };

  const activeLat = selectedCoords ? selectedCoords.lat.toFixed(6) : manualLat;
  const activeLng = selectedCoords ? selectedCoords.lng.toFixed(6) : manualLng;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 relative">
      {submissionSuccess && (
        <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-6 z-20 text-center animate-fade-in">
          <div className="w-14 h-14 bg-emerald-50 text-forest-700 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-stone-900 text-lg">Report Submitted Successfully</h3>
          <p className="text-stone-600 text-sm mt-1 max-w-sm">
            Thank you for your active citizenship. The incident coordinates are logged. Your report is now routed to
            the regional ZASEPA Environmental Officer for validation.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-earth-700" />
        <h3 className="font-display font-semibold text-stone-900 text-base">
          Report Environmental Incident
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Visual Cards Selection */}
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            Threat Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.values(ReportCategory).map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-forest-700 bg-forest-50/50 text-forest-900 ring-1 ring-forest-700"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="text-xs font-semibold leading-tight">{cat}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LGA Selector */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              LGA Jurisdiction
            </label>
            <select
              value={lga}
              onChange={(e) => setLga(e.target.value as any)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/30 px-3 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
            >
              <option value="Gusau">Gusau (State Capital)</option>
              <option value="Maru">Maru (Forestry Zone)</option>
              <option value="Talata Mafara">Talata Mafara (Agricultural sector)</option>
              <option value="Kaura Namoda">Kaura Namoda (Border belt)</option>
              <option value="Anka">Anka (Mining focus)</option>
            </select>
          </div>

          {/* Coordinates Inputs */}
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              Geospatial Coordinates
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">LATITUDE</span>
                <input
                  type="text"
                  value={activeLat}
                  disabled={!!selectedCoords}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-stone-100/50 px-2.5 py-1.5 text-xs font-mono text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700 disabled:opacity-80"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">LONGITUDE</span>
                <input
                  type="text"
                  value={activeLng}
                  disabled={!!selectedCoords}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-stone-100/50 px-2.5 py-1.5 text-xs font-mono text-stone-700 focus:outline-none focus:ring-1 focus:ring-forest-700 disabled:opacity-80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Assist Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleGpsCapture}
            className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition-all"
            disabled={isCapturingGps}
          >
            <Navigation className={`w-3.5 h-3.5 ${isCapturingGps ? "animate-spin text-forest-700" : ""}`} />
            {isCapturingGps ? "Pinging Satellites..." : "Auto-Capture device GPS"}
          </button>
          <button
            type="button"
            onClick={onActivateMapSelection}
            className={`px-3 py-2 rounded-lg border font-medium text-xs flex items-center gap-1.5 transition-all ${
              selectedCoords
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            {selectedCoords ? "Coordinates locked from Map" : "Select coordinates on GIS Map"}
          </button>
        </div>

        {/* Drag-and-drop Image Upload Box */}
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            Photographic Evidence File
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              dragActive ? "border-forest-700 bg-forest-50/30" : "border-stone-200 bg-white hover:bg-stone-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {filePreview ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={filePreview}
                  alt="Incident Preview"
                  className="h-24 w-auto rounded-lg object-cover border border-stone-200 shadow-sm"
                />
                <span className="text-[10px] text-stone-500 font-mono">
                  {selectedFile ? selectedFile.name : "Simulated Attachment Active"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="w-6 h-6 text-stone-400" />
                <p className="text-xs font-medium text-stone-700">Drag & drop photographic logs, or click to browse</p>
                <p className="text-[10px] text-stone-400">Supports PNG, JPG, or cellular camera roll captures</p>
              </div>
            )}
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            Incident Description & Context
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe vehicles involved, felling logs, charcoal kilns, or approximate forest damage in hectares..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50/30 px-3 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-forest-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-forest-700 hover:bg-forest-800 text-white font-medium text-sm py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Dispatch Report to ZASEPA Officers
        </button>
      </form>
    </div>
  );
}
