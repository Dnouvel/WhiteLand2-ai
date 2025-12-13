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

// Sample city plot data for Riyadh, Saudi Arabia
const samplePlots: Plot[] = [
  {
    id: "plot-001",
    address: "King Fahd Road, Al Olaya District",
    parcelNumber: "RY-2024-00123",
    latitude: 24.7136,
    longitude: 46.6753,
    size: 2.5,
    zoning: "C-1 Commercial",
    currentUse: "Mixed Use Development",
    marketValue: 45000000,
    ownerName: "Al Olaya Properties",
    boundaries: [
      [46.6743, 24.7130],
      [46.6763, 24.7130],
      [46.6763, 24.7142],
      [46.6743, 24.7142],
      [46.6743, 24.7130],
    ],
  },
  {
    id: "plot-002",
    address: "Prince Mohammed Bin Salman Road, KAFD",
    parcelNumber: "RY-2024-00456",
    latitude: 24.7648,
    longitude: 46.6426,
    size: 4.2,
    zoning: "MU-2 Mixed Use",
    currentUse: "Financial District",
    marketValue: 120000000,
    ownerName: "KAFD Development Corp",
    boundaries: [
      [46.6410, 24.7638],
      [46.6442, 24.7638],
      [46.6442, 24.7658],
      [46.6410, 24.7658],
      [46.6410, 24.7638],
    ],
  },
  {
    id: "plot-003",
    address: "Al Takhassusi Street, Al Sahafah",
    parcelNumber: "RY-2024-00789",
    latitude: 24.7892,
    longitude: 46.6589,
    size: 1.8,
    zoning: "R-3 Residential",
    currentUse: "Residential Complex",
    marketValue: 32000000,
    ownerName: "Sahafah Real Estate",
    boundaries: [
      [46.6579, 24.7885],
      [46.6599, 24.7885],
      [46.6599, 24.7899],
      [46.6579, 24.7899],
      [46.6579, 24.7885],
    ],
  },
  {
    id: "plot-004",
    address: "King Abdullah Road, Al Malqa",
    parcelNumber: "RY-2024-00321",
    latitude: 24.8156,
    longitude: 46.6234,
    size: 3.5,
    zoning: "C-2 Commercial",
    currentUse: "Vacant Land",
    marketValue: 58000000,
    ownerName: "Malqa Investment Group",
    boundaries: [
      [46.6220, 24.8146],
      [46.6248, 24.8146],
      [46.6248, 24.8166],
      [46.6220, 24.8166],
      [46.6220, 24.8146],
    ],
  },
  {
    id: "plot-005",
    address: "Northern Ring Road, An Narjis",
    parcelNumber: "RY-2024-00555",
    latitude: 24.8423,
    longitude: 46.7012,
    size: 5.8,
    zoning: "I-1 Industrial",
    currentUse: "Logistics Center",
    marketValue: 75000000,
    ownerName: "Narjis Logistics LLC",
    boundaries: [
      [46.6990, 24.8408],
      [46.7034, 24.8408],
      [46.7034, 24.8438],
      [46.6990, 24.8438],
      [46.6990, 24.8408],
    ],
  },
  {
    id: "plot-006",
    address: "Diplomatic Quarter, DQ",
    parcelNumber: "RY-2024-00888",
    latitude: 24.6812,
    longitude: 46.6287,
    size: 2.1,
    zoning: "S-1 Special Use",
    currentUse: "Embassy District",
    marketValue: 95000000,
    ownerName: "DQ Authority",
    boundaries: [
      [46.6272, 24.6802],
      [46.6302, 24.6802],
      [46.6302, 24.6822],
      [46.6272, 24.6822],
      [46.6272, 24.6802],
    ],
  },
  {
    id: "plot-007",
    address: "Exit 5, Eastern Ring Road",
    parcelNumber: "RY-2024-00042",
    latitude: 24.7234,
    longitude: 46.7456,
    size: 8.2,
    zoning: "MU-3 Mixed Use",
    currentUse: "Shopping Mall",
    marketValue: 180000000,
    ownerName: "Eastern Ring Properties",
    boundaries: [
      [46.7430, 24.7214],
      [46.7482, 24.7214],
      [46.7482, 24.7254],
      [46.7430, 24.7254],
      [46.7430, 24.7214],
    ],
  },
  {
    id: "plot-008",
    address: "Tahlia Street, Al Rawdah",
    parcelNumber: "RY-2024-00200",
    latitude: 24.6945,
    longitude: 46.6856,
    size: 1.4,
    zoning: "C-1 Commercial",
    currentUse: "Retail Complex",
    marketValue: 42000000,
    ownerName: "Tahlia Commercial Group",
    boundaries: [
      [46.6846, 24.6938],
      [46.6866, 24.6938],
      [46.6866, 24.6952],
      [46.6846, 24.6952],
      [46.6846, 24.6938],
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
