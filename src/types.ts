/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  VISITOR = "Visitor",
  REGISTERED_USER = "Registered User",
  ENVIRONMENTAL_OFFICER = "Environmental Officer",
  ADMIN = "Admin"
}

export enum ReportCategory {
  ILLEGAL_LOGGING = "Illegal Logging",
  BUSH_BURNING = "Bush Burning",
  DESERT_ENCROACHMENT = "Desert Encroachment",
  UNREGULATED_AGRICULTURE = "Unregulated Agriculture",
  SOIL_EROSION = "Soil Erosion"
}

export enum ReportStatus {
  PENDING = "Pending",
  VERIFIED = "Verified",
  REJECTED = "Rejected",
  RESOLVED = "Resolved"
}

export enum TreeSpecies {
  NEEM = "Neem (Dongoyaro)",
  ACACIA = "Acacia",
  SHEA = "Shea Tree",
  BAOBAB = "Baobab",
  MAHOGANY = "Mahogany"
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  lga: string;
  createdAt: string;
}

export interface IncidentReport {
  id: number;
  reporterId: number;
  reporterName: string;
  category: ReportCategory;
  lga: "Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka";
  latitude: number;
  longitude: number;
  description: string;
  imageUrl?: string;
  status: ReportStatus;
  verifiedBy?: number;
  verifiedDate?: string;
  officerRemarks?: string;
  createdAt: string;
}

export interface TreePlanting {
  id: number;
  userId: number;
  userName: string;
  species: TreeSpecies;
  quantity: number;
  lga: "Gusau" | "Maru" | "Talata Mafara" | "Kaura Namoda" | "Anka";
  latitude: number;
  longitude: number;
  plantingDate: string;
  notes?: string;
  survivalRate: number; // percentage
  createdAt: string;
}

export interface RestorationProject {
  id: number;
  title: string;
  description: string;
  lga: string;
  targetTrees: number;
  plantedTrees: number;
  status: "Planning" | "Active" | "Completed";
  leadAgency: string;
  startDate: string;
  endDate?: string;
}

export interface AwarenessArticle {
  id: number;
  title: string;
  content: string;
  authorName: string;
  category: "Conservation" | "Policy" | "Reforestation" | "Desertification";
  publishedAt: string;
  readTime: string;
}

export interface SystemLog {
  id: number;
  userId?: number;
  userName?: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}
