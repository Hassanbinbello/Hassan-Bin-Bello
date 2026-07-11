/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Trees, Flame, AlertCircle, Sparkles, Navigation } from "lucide-react";
import { IncidentReport, TreePlanting } from "../types";

interface InteractiveMapProps {
  reports: IncidentReport[];
  plantings: TreePlanting[];
  selectedLga: string | null;
  onLgaSelect: (lga: string | null) => void;
  onCoordinatesSelect?: (lat: number, lng: number) => void;
  interactiveSelection?: boolean;
}

// Bounding coordinates for Zamfara SVG projection
// Lat: ~11.3 to 13.0, Lng: ~5.3 to 7.1
const MAP_BOUNDS = {
  minLat: 11.3,
  maxLat: 13.0,
  minLng: 5.3,
  maxLng: 7.1,
};

export default function InteractiveMap({
  reports,
  plantings,
  selectedLga,
  onLgaSelect,
  onCoordinatesSelect,
  interactiveSelection = false,
}: InteractiveMapProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showTrees, setShowTrees] = useState(true);
  const [tempPin, setTempPin] = useState<{ lat: number; lng: number } | null>(null);

  const svgWidth = 500;
  const svgHeight = 400;

  // Projection function: Convert real Lat/Lng to SVG X/Y
  const getXY = (lat: number, lng: number) => {
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * svgWidth;
    // Y-axis is inverted in SVG
    const y = svgHeight - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * svgHeight;
    return { x, y };
  };

  // Projection function: Convert SVG X/Y to real Lat/Lng
  const getLatLng = (x: number, y: number) => {
    const lng = MAP_BOUNDS.minLng + (x / svgWidth) * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
    const lat = MAP_BOUNDS.minLat + ((svgHeight - y) / svgHeight) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
    return {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    };
  };

  // Geographic SVG Path estimates for Zamfara LGAs
  const lgasData = [
    {
      name: "Maru",
      path: "M 40,320 L 120,310 L 160,250 L 150,170 L 90,160 L 60,220 Z",
      centerLat: 11.9,
      centerLng: 5.8,
      desc: "Largest forest reserve sector, highly vulnerable to illegal timber cutting.",
      color: "fill-stone-200/90 hover:fill-stone-300/90 stroke-stone-400",
    },
    {
      name: "Anka",
      path: "M 120,310 L 210,290 L 220,230 L 160,250 Z",
      centerLat: 12.1,
      centerLng: 6.0,
      desc: "Mining heavy region, suffering from soil erosion and deforestation.",
      color: "fill-amber-100 hover:fill-amber-200 stroke-amber-400",
    },
    {
      name: "Talata Mafara",
      path: "M 90,160 L 150,170 L 220,130 L 190,80 L 110,100 Z",
      centerLat: 12.55,
      centerLng: 6.05,
      desc: "Agricultural basin experiencing active desertification vectors.",
      color: "fill-amber-50 hover:fill-amber-100 stroke-amber-300",
    },
    {
      name: "Kaura Namoda",
      path: "M 220,130 L 320,110 L 380,50 L 310,40 L 240,60 Z",
      centerLat: 12.8,
      centerLng: 6.6,
      desc: "Sahelian boundary zone showing active desert encroachment.",
      color: "fill-orange-50 hover:fill-orange-100 stroke-orange-300",
    },
    {
      name: "Gusau",
      path: "M 220,230 L 320,220 L 350,160 L 320,110 L 220,130 Z",
      centerLat: 12.16,
      centerLng: 6.66,
      desc: "State Capital; focus area for urban greening and public park reforestation.",
      color: "fill-emerald-50 hover:fill-emerald-100 stroke-emerald-300",
    },
  ];

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactiveSelection || !onCoordinatesSelect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { lat, lng } = getLatLng(x, y);
    setTempPin({ lat, lng });
    onCoordinatesSelect(lat, lng);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Map Control Bar */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-forest-700" />
          <h3 className="font-display font-medium text-stone-900 text-sm">
            GreenWatch Web-GIS Engine (Zamfara State)
          </h3>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              showHeatmap
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Heatmap Layer
          </button>
          <button
            onClick={() => setShowTrees(!showTrees)}
            className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              showTrees
                ? "bg-emerald-50 text-forest-800 border-emerald-200"
                : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            Tree Planting Layer
          </button>
        </div>
      </div>

      {/* Map SVG Canvas */}
      <div className="relative flex-1 bg-sky-50/30 flex items-center justify-center p-4">
        {interactiveSelection && (
          <div className="absolute top-4 left-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-2 text-xs z-10 flex items-center gap-1.5 shadow-sm max-w-[280px]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>GIS Mode Active:</strong> Click anywhere on the map to pin precise reporting coordinates.
            </span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[500px] h-auto drop-shadow-md select-none cursor-pointer"
          onClick={handleMapClick}
        >
          {/* Legend and Grid Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e7e5e4" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="opacity-40" />

          {/* Render LGA Polygons */}
          <g>
            {lgasData.map((lga) => {
              const isSelected = selectedLga === lga.name;
              return (
                <path
                  key={lga.name}
                  d={lga.path}
                  className={`transition-all duration-300 ${lga.color} ${
                    isSelected ? "fill-forest-100/90 stroke-forest-600 stroke-2" : "stroke-1"
                  }`}
                  onClick={(e) => {
                    // Prevent triggering coordinates placement when selecting LGA if it's not map click mode
                    if (!interactiveSelection) {
                      e.stopPropagation();
                      onLgaSelect(isSelected ? null : lga.name);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* LGA Text Labels */}
          {lgasData.map((lga) => {
            const { x, y } = getXY(lga.centerLat, lga.centerLng);
            return (
              <g key={`label-${lga.name}`} className="pointer-events-none">
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className="font-display font-semibold text-[10px] fill-stone-800 tracking-wider"
                >
                  {lga.name.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Render Heatmap Warning Zones (from Verified Incident Reports) */}
          {showHeatmap &&
            reports
              .filter((r) => r.status === "Verified")
              .map((report) => {
                const { x, y } = getXY(report.latitude, report.longitude);
                return (
                  <g key={`heatmap-${report.id}`}>
                    {/* Glowing outer alarm ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      className="fill-red-500/10 stroke-red-500/20 stroke-1 animate-pulse"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      className="fill-red-500/25 stroke-red-500/40 stroke-1"
                    />
                    <circle cx={x} cy={y} r="3" className="fill-red-600" />
                  </g>
                );
              })}

          {/* Render Pending Incident Pins (Flickering Warning) */}
          {reports
            .filter((r) => r.status === "Pending")
            .map((report) => {
              const { x, y } = getXY(report.latitude, report.longitude);
              return (
                <g key={`pending-pin-${report.id}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    className="fill-amber-500/20 stroke-amber-500 animate-ping"
                  />
                  <circle cx={x} cy={y} r="4" className="fill-amber-500 stroke-amber-600" />
                </g>
              );
            })}

          {/* Render Tree Planting Achievements (Green Leaf icons/dots) */}
          {showTrees &&
            plantings.map((tree) => {
              const { x, y } = getXY(tree.latitude, tree.longitude);
              return (
                <g key={`tree-pin-${tree.id}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    className="fill-emerald-500/10 stroke-emerald-500/25 stroke-0.5"
                  />
                  <polygon
                    points={`${x},${y - 5} ${x - 4},${y + 3} ${x + 4},${y + 3}`}
                    className="fill-forest-600 stroke-forest-800 stroke-0.5"
                  />
                </g>
              );
            })}

          {/* Render User Selected Manual Coordinates Pin */}
          {tempPin && (
            <g key="manual-temp-pin" className="animate-bounce">
              <path
                d={`M ${getXY(tempPin.lat, tempPin.lng).x} ${getXY(tempPin.lat, tempPin.lng).y} l -5 -12 a 5 5 0 1 1 10 0 Z`}
                className="fill-blue-600 stroke-blue-800 stroke-1"
              />
              <circle
                cx={getXY(tempPin.lat, tempPin.lng).x}
                cy={getXY(tempPin.lat, tempPin.lng).y - 12}
                r="2"
                className="fill-white"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Selected LGA Informational Footer card */}
      <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex flex-col gap-2">
        {selectedLga ? (
          (() => {
            const lgaInfo = lgasData.find((l) => l.name === selectedLga);
            const lgaReports = reports.filter((r) => r.lga === selectedLga);
            const lgaPlantings = plantings.filter((p) => p.lga === selectedLga);
            const totalTrees = lgaPlantings.reduce((sum, p) => sum + p.quantity, 0);

            return (
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-semibold text-stone-900 text-sm">
                    {selectedLga} Local Government Area
                  </h4>
                  <button
                    onClick={() => onLgaSelect(null)}
                    className="text-xs text-stone-500 hover:text-stone-700 underline"
                  >
                    Clear Filter
                  </button>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{lgaInfo?.desc}</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200/60 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                        Threat Alerts
                      </div>
                      <div className="font-display font-semibold text-stone-800 text-xs">
                        {lgaReports.length} logged incidents
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200/60 flex items-center gap-2">
                    <Trees className="w-4 h-4 text-forest-600" />
                    <div>
                      <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                        Seedlings Planted
                      </div>
                      <div className="font-display font-semibold text-stone-800 text-xs">
                        {totalTrees} specimens mapped
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-xs text-stone-500 text-center py-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-forest-600 animate-pulse" />
            <span>Click any territory on the vector map to filter reports and environmental diagnostics.</span>
          </div>
        )}
      </div>
    </div>
  );
}
