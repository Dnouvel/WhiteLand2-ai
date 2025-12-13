import { type Plot, type InsertPlot, type HbuStudy, type InsertHbuStudy, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Plots
  getAllPlots(): Promise<Plot[]>;
  getPlot(id: string): Promise<Plot | undefined>;
  createPlot(plot: InsertPlot): Promise<Plot>;
  
  // HBU Studies
  getStudiesForPlot(plotId: string): Promise<HbuStudy[]>;
  getStudy(id: string): Promise<HbuStudy | undefined>;
  createStudy(study: InsertHbuStudy): Promise<HbuStudy>;
  
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// Sample city plot data for NYC area
const samplePlots: Plot[] = [
  {
    id: "plot-001",
    address: "123 Wall Street, Manhattan",
    parcelNumber: "MN-2024-00123",
    latitude: 40.7074,
    longitude: -74.0104,
    size: 0.45,
    zoning: "C6-4",
    currentUse: "Commercial Office",
    marketValue: 8500000,
    ownerName: "Metro Properties LLC",
    boundaries: [
      [-74.0108, 40.7072],
      [-74.0100, 40.7072],
      [-74.0100, 40.7076],
      [-74.0108, 40.7076],
      [-74.0108, 40.7072],
    ],
  },
  {
    id: "plot-002",
    address: "456 Broadway, SoHo",
    parcelNumber: "MN-2024-00456",
    latitude: 40.7223,
    longitude: -73.9986,
    size: 0.32,
    zoning: "M1-5B",
    currentUse: "Mixed Use Retail",
    marketValue: 12000000,
    ownerName: "SoHo Investments Inc",
    boundaries: [
      [-73.9990, 40.7220],
      [-73.9982, 40.7220],
      [-73.9982, 40.7226],
      [-73.9990, 40.7226],
      [-73.9990, 40.7220],
    ],
  },
  {
    id: "plot-003",
    address: "789 Park Avenue, Upper East Side",
    parcelNumber: "MN-2024-00789",
    latitude: 40.7658,
    longitude: -73.9654,
    size: 0.68,
    zoning: "R10",
    currentUse: "Residential High-Rise",
    marketValue: 45000000,
    ownerName: "Park Avenue Holdings",
    boundaries: [
      [-73.9658, 40.7655],
      [-73.9650, 40.7655],
      [-73.9650, 40.7661],
      [-73.9658, 40.7661],
      [-73.9658, 40.7655],
    ],
  },
  {
    id: "plot-004",
    address: "321 Hudson Street, West Village",
    parcelNumber: "MN-2024-00321",
    latitude: 40.7308,
    longitude: -74.0074,
    size: 0.28,
    zoning: "C2-6",
    currentUse: "Vacant Lot",
    marketValue: 4200000,
    ownerName: "Village Development Corp",
    boundaries: [
      [-74.0078, 40.7305],
      [-74.0070, 40.7305],
      [-74.0070, 40.7311],
      [-74.0078, 40.7311],
      [-74.0078, 40.7305],
    ],
  },
  {
    id: "plot-005",
    address: "555 Water Street, DUMBO Brooklyn",
    parcelNumber: "BK-2024-00555",
    latitude: 40.7033,
    longitude: -73.9889,
    size: 1.2,
    zoning: "M1-4/R8A",
    currentUse: "Industrial Warehouse",
    marketValue: 22000000,
    ownerName: "Brooklyn Waterfront LLC",
    boundaries: [
      [-73.9895, 40.7028],
      [-73.9883, 40.7028],
      [-73.9883, 40.7038],
      [-73.9895, 40.7038],
      [-73.9895, 40.7028],
    ],
  },
  {
    id: "plot-006",
    address: "888 Atlantic Avenue, Brooklyn",
    parcelNumber: "BK-2024-00888",
    latitude: 40.6844,
    longitude: -73.9750,
    size: 0.95,
    zoning: "C4-5X",
    currentUse: "Parking Lot",
    marketValue: 15500000,
    ownerName: "Atlantic Basin Partners",
    boundaries: [
      [-73.9756, 40.6840],
      [-73.9744, 40.6840],
      [-73.9744, 40.6848],
      [-73.9756, 40.6848],
      [-73.9756, 40.6840],
    ],
  },
  {
    id: "plot-007",
    address: "42 Court Street, Downtown Brooklyn",
    parcelNumber: "BK-2024-00042",
    latitude: 40.6930,
    longitude: -73.9910,
    size: 0.55,
    zoning: "C6-2",
    currentUse: "Office Building",
    marketValue: 18000000,
    ownerName: "Court Street Properties",
    boundaries: [
      [-73.9915, 40.6926],
      [-73.9905, 40.6926],
      [-73.9905, 40.6934],
      [-73.9915, 40.6934],
      [-73.9915, 40.6926],
    ],
  },
  {
    id: "plot-008",
    address: "200 Fifth Avenue, Flatiron",
    parcelNumber: "MN-2024-00200",
    latitude: 40.7410,
    longitude: -73.9897,
    size: 0.42,
    zoning: "C5-2",
    currentUse: "Retail Complex",
    marketValue: 28000000,
    ownerName: "Flatiron Retail Group",
    boundaries: [
      [-73.9902, 40.7407],
      [-73.9892, 40.7407],
      [-73.9892, 40.7413],
      [-73.9902, 40.7413],
      [-73.9902, 40.7407],
    ],
  },
];

export class MemStorage implements IStorage {
  private plots: Map<string, Plot>;
  private studies: Map<string, HbuStudy>;
  private users: Map<string, User>;

  constructor() {
    this.plots = new Map();
    this.studies = new Map();
    this.users = new Map();
    
    // Initialize with sample plots
    samplePlots.forEach(plot => {
      this.plots.set(plot.id, plot);
    });
  }

  // Plots
  async getAllPlots(): Promise<Plot[]> {
    return Array.from(this.plots.values());
  }

  async getPlot(id: string): Promise<Plot | undefined> {
    return this.plots.get(id);
  }

  async createPlot(insertPlot: InsertPlot): Promise<Plot> {
    const id = `plot-${randomUUID()}`;
    const plot: Plot = { ...insertPlot, id };
    this.plots.set(id, plot);
    return plot;
  }

  // HBU Studies
  async getStudiesForPlot(plotId: string): Promise<HbuStudy[]> {
    return Array.from(this.studies.values()).filter(s => s.plotId === plotId);
  }

  async getStudy(id: string): Promise<HbuStudy | undefined> {
    return this.studies.get(id);
  }

  async createStudy(insertStudy: InsertHbuStudy): Promise<HbuStudy> {
    const id = `study-${randomUUID()}`;
    const study: HbuStudy = { 
      ...insertStudy, 
      id,
      createdAt: new Date(),
    };
    this.studies.set(id, study);
    return study;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
