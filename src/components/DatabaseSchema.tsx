/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Check, Database, Key, Server, Terminal, List, Layers } from "lucide-react";

interface TableField {
  name: string;
  type: string;
  nullable: "YES" | "NO";
  key: "PK" | "FK" | "Unique" | "";
  description: string;
}

interface TableDefinition {
  name: string;
  description: string;
  fields: TableField[];
}

const SCHEMA_DEFINITIONS: TableDefinition[] = [
  {
    name: "users",
    description: "Core table storing citizen accounts, environmental officers, and system administrators.",
    fields: [
      { name: "id", type: "INT AUTO_INCREMENT", nullable: "NO", key: "PK", description: "Primary key" },
      { name: "email", type: "VARCHAR(191)", nullable: "NO", key: "Unique", description: "Unique user login address" },
      { name: "password_hash", type: "VARCHAR(255)", nullable: "NO", key: "", description: "Hashed password via Bcrypt" },
      { name: "full_name", type: "VARCHAR(100)", nullable: "NO", key: "", description: "User's full name" },
      { name: "role", type: "ENUM('Visitor', 'Registered User', 'Environmental Officer', 'Admin')", nullable: "NO", key: "", description: "Access level controls (Default: 'Registered User')" },
      { name: "phone", type: "VARCHAR(20)", nullable: "NO", key: "", description: "Contact phone number" },
      { name: "lga", type: "VARCHAR(50)", nullable: "NO", key: "", description: "User's home LGA" },
      { name: "created_at", type: "TIMESTAMP", nullable: "NO", key: "", description: "Auto timestamp (Default: CURRENT_TIMESTAMP)" },
    ],
  },
  {
    name: "reports",
    description: "Citizen crowdsourced environmental threat incident logs (deforestation, fires, erosion).",
    fields: [
      { name: "id", type: "INT AUTO_INCREMENT", nullable: "NO", key: "PK", description: "Unique report key" },
      { name: "reporter_id", type: "INT", nullable: "NO", key: "FK", description: "References users(id) - ON DELETE RESTRICT" },
      { name: "category", type: "ENUM('Illegal Logging', 'Bush Burning', 'Desert Encroachment', 'Unregulated Agriculture', 'Soil Erosion')", nullable: "NO", key: "", description: "Ecology alert classification" },
      { name: "lga", type: "ENUM('Gusau', 'Maru', 'Talata Mafara', 'Kaura Namoda', 'Anka')", nullable: "NO", key: "", description: "Zamfara Local Gov Area coordinates center" },
      { name: "latitude", type: "DECIMAL(10, 8)", nullable: "NO", key: "", description: "Geographic latitude check (-90 to 90)" },
      { name: "longitude", type: "DECIMAL(11, 8)", nullable: "NO", key: "", description: "Geographic longitude check (-180 to 180)" },
      { name: "description", type: "TEXT", nullable: "NO", key: "", description: "Citizen text details of incident" },
      { name: "image_url", type: "VARCHAR(255)", nullable: "YES", key: "", description: "Hosted URL on Cloudinary CDN" },
      { name: "status", type: "ENUM('Pending', 'Verified', 'Rejected', 'Resolved')", nullable: "NO", key: "", description: "Workflow state transitions (Default: 'Pending')" },
      { name: "verified_by", type: "INT", nullable: "YES", key: "FK", description: "References users(id) (Officer) - ON DELETE SET NULL" },
      { name: "officer_remarks", type: "TEXT", nullable: "YES", key: "", description: "Inspector feedback noted during review" },
      { name: "created_at", type: "TIMESTAMP", nullable: "NO", key: "", description: "Report timestamp" },
    ],
  },
  {
    name: "tree_planting",
    description: "Crowdsourced and institutional reforestation events, tracking survival metrics.",
    fields: [
      { name: "id", type: "INT AUTO_INCREMENT", nullable: "NO", key: "PK", description: "Primary key" },
      { name: "user_id", type: "INT", nullable: "NO", key: "FK", description: "References users(id) - ON DELETE CASCADE" },
      { name: "species", type: "ENUM('Neem (Dongoyaro)', 'Acacia', 'Shea Tree', 'Baobab', 'Mahogany')", nullable: "NO", key: "", description: "Botanical taxonomy mapped" },
      { name: "quantity", type: "INT", nullable: "NO", key: "", description: "Number of specimens planted (Must be > 0)" },
      { name: "lga", type: "ENUM('Gusau', 'Maru', 'Talata Mafara', 'Kaura Namoda', 'Anka')", nullable: "NO", key: "", description: "LGA planting location" },
      { name: "latitude", type: "DECIMAL(10, 8)", nullable: "NO", key: "", description: "Latitude coordinates" },
      { name: "longitude", type: "DECIMAL(11, 8)", nullable: "NO", key: "", description: "Longitude coordinates" },
      { name: "planting_date", type: "DATE", nullable: "NO", key: "", description: "Date planted" },
      { name: "survival_rate", type: "DECIMAL(5, 2)", nullable: "NO", key: "", description: "Seedling survival percentage (0.00 to 100.00)" },
      { name: "notes", type: "TEXT", nullable: "YES", key: "", description: "Fertilizer, moisture or fencing logs" },
      { name: "created_at", type: "TIMESTAMP", nullable: "NO", key: "", description: "Auto timestamp" },
    ],
  },
  {
    name: "restoration_projects",
    description: "Official institutional campaigns mapping large-scale forest reserve reclamation.",
    fields: [
      { name: "id", type: "INT AUTO_INCREMENT", nullable: "NO", key: "PK", description: "Primary key" },
      { name: "title", type: "VARCHAR(150)", nullable: "NO", key: "", description: "Campaign Title" },
      { name: "description", type: "TEXT", nullable: "NO", key: "", description: "Scope and ecological goals" },
      { name: "lga", type: "VARCHAR(50)", nullable: "NO", key: "", description: "Geographic sector region" },
      { name: "target_trees", type: "INT", nullable: "NO", key: "", description: "Seedlings quota target" },
      { name: "planted_trees", type: "INT", nullable: "NO", key: "", description: "Seedlings currently mapped to coordinates" },
      { name: "status", type: "ENUM('Planning', 'Active', 'Completed')", nullable: "NO", key: "", description: "Status metrics (Default: 'Planning')" },
      { name: "lead_agency", type: "VARCHAR(100)", nullable: "NO", key: "", description: "e.g. 'ZASEPA', 'Great Green Wall Agency'" },
      { name: "start_date", type: "DATE", nullable: "NO", key: "", description: "Project launch date" },
      { name: "end_date", type: "DATE", nullable: "YES", key: "", description: "Project completion target date" },
    ],
  },
  {
    name: "system_logs",
    description: "Immutable transactional log audits for system security tracking.",
    fields: [
      { name: "id", type: "INT AUTO_INCREMENT", nullable: "NO", key: "PK", description: "Primary key" },
      { name: "user_id", type: "INT", nullable: "YES", key: "FK", description: "Actor index. References users(id) ON DELETE SET NULL" },
      { name: "action", type: "VARCHAR(255)", nullable: "NO", key: "", description: "System event action string payload" },
      { name: "ip_address", type: "VARCHAR(45)", nullable: "NO", key: "", description: "User IPv4/IPv6 address" },
      { name: "severity", type: "ENUM('INFO', 'WARNING', 'CRITICAL')", nullable: "NO", key: "", description: "Audit security flags (Default: 'INFO')" },
      { name: "timestamp", type: "TIMESTAMP", nullable: "NO", key: "", description: "Timestamp of log event" },
    ],
  },
];

const MYSQL_DDL_SCRIPT = `-- ========================================================
-- DATABASE SCHEMA BLUEPRINT FOR GREENWATCH ZAMFARA
-- Target Database System: MySQL 8.0+
-- Relational Normalization Level: Third Normal Form (3NF)
-- Designed by: Academic Principal Supervisor & Architect
-- ========================================================

CREATE DATABASE IF NOT EXISTS greenwatch_zamfara;
USE greenwatch_zamfara;

-- 1. Create USERS Table
CREATE TABLE users (
    id INT AUTO_INCREMENT,
    email VARCHAR(191) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Visitor', 'Registered User', 'Environmental Officer', 'Admin') NOT NULL DEFAULT 'Registered User',
    phone VARCHAR(20) NOT NULL,
    lga VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_user_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create REPORTS Table
CREATE TABLE reports (
    id INT AUTO_INCREMENT,
    reporter_id INT NOT NULL,
    category ENUM('Illegal Logging', 'Bush Burning', 'Desert Encroachment', 'Unregulated Agriculture', 'Soil Erosion') NOT NULL,
    lga ENUM('Gusau', 'Maru', 'Talata Mafara', 'Kaura Namoda', 'Anka') NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    status ENUM('Pending', 'Verified', 'Rejected', 'Resolved') NOT NULL DEFAULT 'Pending',
    verified_by INT DEFAULT NULL,
    officer_remarks TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_reports PRIMARY KEY (id),
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reports_verifier FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_report_coordinates CHECK (latitude BETWEEN -90.0 AND 90.0 AND longitude BETWEEN -180.0 AND 180.0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create TREE_PLANTING Table
CREATE TABLE tree_planting (
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    species ENUM('Neem (Dongoyaro)', 'Acacia', 'Shea Tree', 'Baobab', 'Mahogany') NOT NULL,
    quantity INT NOT NULL,
    lga ENUM('Gusau', 'Maru', 'Talata Mafara', 'Kaura Namoda', 'Anka') NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    planting_date DATE NOT NULL,
    survival_rate DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tree_planting PRIMARY KEY (id),
    CONSTRAINT fk_tree_planting_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_planting_quantity CHECK (quantity > 0),
    CONSTRAINT chk_survival_rate CHECK (survival_rate BETWEEN 0.0 AND 100.0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create RESTORATION_PROJECTS Table
CREATE TABLE restoration_projects (
    id INT AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    lga VARCHAR(50) NOT NULL,
    target_trees INT NOT NULL,
    planted_trees INT NOT NULL DEFAULT 0,
    status ENUM('Planning', 'Active', 'Completed') NOT NULL DEFAULT 'Planning',
    lead_agency VARCHAR(100) NOT NULL DEFAULT 'ZASEPA',
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    CONSTRAINT pk_restoration_projects PRIMARY KEY (id),
    CONSTRAINT chk_project_target CHECK (target_trees > 0),
    CONSTRAINT chk_project_progress CHECK (planted_trees <= target_trees)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create SYSTEM_LOGS Table
CREATE TABLE system_logs (
    id INT AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    severity ENUM('INFO', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'INFO',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_system_logs PRIMARY KEY (id),
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- INDEX OPTIMIZATIONS FOR HIGH-SPEED GEOGRAPHIC QUERIES
-- ========================================================
CREATE INDEX idx_reports_lga_status ON reports(lga, status);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_tree_planting_species ON tree_planting(species);
CREATE INDEX idx_tree_planting_lga ON tree_planting(lga);
CREATE INDEX idx_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_users_email ON users(email);
`;

export default function DatabaseSchema() {
  const [activeTable, setActiveTable] = useState<string>("reports");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MYSQL_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTable = SCHEMA_DEFINITIONS.find((t) => t.name === activeTable) || SCHEMA_DEFINITIONS[1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table select list & copy panel */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-forest-700" />
            <h4 className="font-display font-semibold text-stone-900 text-sm">
              3NF Schema Entity Dictionary
            </h4>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Select a MySQL relational table to inspect atomic attributes, null statuses, primary/foreign key mappings, and indexing constraints.
          </p>

          <div className="space-y-1.5">
            {SCHEMA_DEFINITIONS.map((table) => {
              const isActive = table.name === activeTable;
              return (
                <button
                  key={table.name}
                  onClick={() => setActiveTable(table.name)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? "border-forest-700 bg-forest-50/50 text-forest-900 shadow-xs"
                      : "border-stone-100 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <span className="font-mono">greenwatch_zamfara.{table.name}</span>
                  <List className="w-3.5 h-3.5 text-stone-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ERD Relationship Mapper visual guide */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-earth-700" />
            <h5 className="font-display font-semibold text-stone-900 text-xs">
              Relational Linkages (ERD Abstract)
            </h5>
          </div>

          <div className="space-y-2 text-[11px] font-mono border-l-2 border-stone-200 pl-3">
            <div className="bg-stone-50 p-1.5 rounded border border-stone-100/60">
              <span className="text-forest-700 font-bold">users.id</span> (1) 
              <span className="text-stone-400"> ─── </span> 
              (0..*) <span className="text-stone-700 font-bold">reports.reporter_id</span>
            </div>
            <div className="bg-stone-50 p-1.5 rounded border border-stone-100/60">
              <span className="text-forest-700 font-bold">users.id</span> (1) 
              <span className="text-stone-400"> ─── </span> 
              (0..*) <span className="text-stone-700 font-bold">tree_planting.user_id</span>
            </div>
            <div className="bg-stone-50 p-1.5 rounded border border-stone-100/60">
              <span className="text-forest-700 font-bold">users.id</span> (1) 
              <span className="text-stone-400"> ─── </span> 
              (0..1) <span className="text-stone-700 font-bold">reports.verified_by</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database dictionary table details & Code viewer */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-display font-bold text-stone-900 text-sm">
                Table: <span className="font-mono text-forest-700">{currentTable.name}</span>
              </h4>
              <p className="text-xs text-stone-500 mt-1">{currentTable.description}</p>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  SQL Script Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Complete SQL DDL
                </>
              )}
            </button>
          </div>

          {/* Dictionaries Grid */}
          <div className="overflow-x-auto rounded-xl border border-stone-100 bg-stone-50/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 text-stone-500 font-mono text-[10px] uppercase tracking-wider border-b border-stone-200">
                  <th className="p-3">Field</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Null</th>
                  <th className="p-3 text-center">Key</th>
                  <th className="p-3">Description / Constraints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {currentTable.fields.map((field) => (
                  <tr key={field.name} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-800">{field.name}</td>
                    <td className="p-3 font-mono text-stone-600">{field.type}</td>
                    <td className="p-3 font-mono text-stone-400">{field.nullable}</td>
                    <td className="p-3 text-center">
                      {field.key === "PK" && (
                        <span className="inline-flex items-center gap-0.5 bg-yellow-50 text-yellow-800 px-1.5 py-0.5 rounded font-mono font-bold text-[9px]">
                          <Key className="w-2.5 h-2.5" /> PK
                        </span>
                      )}
                      {field.key === "FK" && (
                        <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold text-[9px]">
                          <Key className="w-2.5 h-2.5" /> FK
                        </span>
                      )}
                      {field.key === "Unique" && (
                        <span className="inline-flex items-center bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-mono font-bold text-[9px]">
                          UQ
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-stone-600">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive SQL terminal wrapper */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-md">
          <div className="p-3.5 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="font-mono text-[11px] text-stone-300">MySQL production_ddl_optimized.sql</span>
            </div>
            <span className="text-[10px] text-stone-500 font-mono uppercase">Read-only sandbox</span>
          </div>
          <div className="p-4 overflow-y-auto max-h-[220px] font-mono text-[11px] text-stone-300 leading-relaxed scrollbar-thin">
            <pre className="text-emerald-400/90 whitespace-pre">
              {MYSQL_DDL_SCRIPT.slice(0, 1000) + "\n\n/* -- ... [Copy complete SQL script for full 3NF schemas] ... -- */"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
