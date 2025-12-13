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

// HBU Study schema
export const hbuStudies = pgTable("hbu_studies", {
  id: varchar("id").primaryKey(),
  plotId: varchar("plot_id").notNull().references(() => plots.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  executiveSummary: text("executive_summary").notNull(),
  zoningAnalysis: text("zoning_analysis").notNull(),
  marketDemand: text("market_demand").notNull(),
  financialFeasibility: text("financial_feasibility").notNull(),
  developmentRecommendations: text("development_recommendations").notNull(),
  supportingData: jsonb("supporting_data").$type<Record<string, unknown>>(),
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
