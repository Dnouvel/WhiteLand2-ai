import { pgTable, text, varchar, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Plot data schema
export const plots = pgTable("plots", {
  id: varchar("id").primaryKey(),
  address: text("address").notNull(),
  parcelNumber: text("parcel_number").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  size: real("size").notNull(), // in acres
  zoning: text("zoning").notNull(),
  currentUse: text("current_use").notNull(),
  marketValue: real("market_value"),
  ownerName: text("owner_name"),
  boundaries: jsonb("boundaries").$type<number[][]>(), // GeoJSON-like polygon coordinates
});

// Enhanced HBU Analysis Types
export interface DevelopmentScenario {
  name: string;
  description: string;
  landUse: string;
  gfa: number;
  units?: number;
  estimatedCost: number;
  projectedRevenue: number;
  irr: number;
  npv: number;
  paybackPeriod: number;
  riskLevel: string;
}

export interface ZoningDetails {
  zoningCode: string;
  landUseCategory: string;
  permittedUses: string[];
  conditionalUses: string[];
  maxFAR: number;
  maxHeight: number;
  maxCoverage: number;
  setbacks: { front: number; rear: number; side: number };
  parkingRequirements: string;
  buildingCodeNotes: string;
}

export interface MarketData {
  demandDrivers: string[];
  comparableTransactions: string;
  absorptionRate: string;
  vacancyRate: string;
  averageRent: string;
  capRate: string;
  marketTrends: string;
}

export interface SpaceProgram {
  totalGFA: number;
  buildableArea: number;
  efficiency: number;
  floors: number;
  components: { use: string; area: number; percentage: number }[];
}

export interface FinancialSummary {
  landValue: number;
  hardCosts: number;
  softCosts: number;
  totalDevelopmentCost: number;
  debtFinancing: number;
  equityRequired: number;
  projectedNOI: number;
  stabilizedValue: number;
  developmentMargin: number;
  returnOnCost: number;
}

// HBU Study schema
export const hbuStudies = pgTable("hbu_studies", {
  id: varchar("id").primaryKey(),
  plotId: varchar("plot_id").notNull().references(() => plots.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  executiveSummary: text("executive_summary").notNull(),
  zoningDetails: jsonb("zoning_details").$type<ZoningDetails>(),
  marketData: jsonb("market_data").$type<MarketData>(),
  scenarios: jsonb("scenarios").$type<DevelopmentScenario[]>(),
  recommendedScenario: text("recommended_scenario"),
  spaceProgram: jsonb("space_program").$type<SpaceProgram>(),
  financialSummary: jsonb("financial_summary").$type<FinancialSummary>(),
  riskFactors: jsonb("risk_factors").$type<string[]>(),
  conclusion: text("conclusion"),
});

// Users schema for future auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
});

// Insert schemas
export const insertPlotSchema = createInsertSchema(plots).omit({ id: true });
export const insertHbuStudySchema = createInsertSchema(hbuStudies).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

// Types
export type Plot = typeof plots.$inferSelect;
export type InsertPlot = z.infer<typeof insertPlotSchema>;
export type HbuStudy = typeof hbuStudies.$inferSelect;
export type InsertHbuStudy = z.infer<typeof insertHbuStudySchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Frontend-specific types
export interface PlotWithStudies extends Plot {
  studies?: HbuStudy[];
}

export interface HbuStudyRequest {
  plotId: string;
}

export interface HbuStudyResponse {
  study: HbuStudy;
}
