import type { Plot, HbuStudy, DevelopmentScenario, ZoningDetails, MarketData, SpaceProgram, FinancialSummary } from "@shared/schema";

export const staticPlots: Plot[] = [
  {
    id: "plot-001",
    address: "King Fahd Road, Al Olaya District",
    parcelNumber: "RY-2024-00123",
    latitude: 24.7136,
    longitude: 46.6753,
    size: 10117,
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
    size: 16997,
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
    size: 7284,
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
    size: 14164,
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
    size: 23472,
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
    size: 8498,
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
    size: 33184,
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
    size: 5666,
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

function generateHbuStudy(plotId: string, plot: Plot): HbuStudy {
  const plotSize = plot.size;
  const maxFAR = plot.zoning.includes('Commercial') ? 4.0 : plot.zoning.includes('Mixed') ? 3.5 : 2.5;
  const maxGFA = Math.round(plotSize * maxFAR);
  
  const scenarios: DevelopmentScenario[] = [
    {
      name: "Scenario 1: Conservative Mixed-Use",
      description: `A prudent development approach focusing on retail at ground level with Grade A office space above. This scenario minimizes risk while providing steady returns aligned with current market absorption rates.`,
      landUse: "Mixed-Use (Retail/Office)",
      gfa: Math.round(maxGFA * 0.6),
      units: undefined,
      estimatedCost: Math.round(maxGFA * 0.6 * 4500),
      projectedRevenue: Math.round(maxGFA * 0.6 * 7200),
      irr: 16.5,
      npv: Math.round(maxGFA * 0.6 * 1200),
      paybackPeriod: 5.8,
      riskLevel: "Low"
    },
    {
      name: "Scenario 2: Balanced Development",
      description: `Optimized mixed-use development combining retail, office, and residential components to capture multiple revenue streams. Aligned with Vision 2030 urban densification goals.`,
      landUse: "Mixed-Use (Retail/Office/Residential)",
      gfa: Math.round(maxGFA * 0.8),
      units: Math.round(maxGFA * 0.8 * 0.3 / 120),
      estimatedCost: Math.round(maxGFA * 0.8 * 5200),
      projectedRevenue: Math.round(maxGFA * 0.8 * 8500),
      irr: 21.2,
      npv: Math.round(maxGFA * 0.8 * 1800),
      paybackPeriod: 4.5,
      riskLevel: "Medium"
    },
    {
      name: "Scenario 3: Premium Tower Development",
      description: `Maximizing FAR with a landmark tower featuring premium office space, luxury residential units, and high-end retail. Higher risk but significant upside potential given Riyadh's growth trajectory.`,
      landUse: "Premium Mixed-Use Tower",
      gfa: maxGFA,
      units: Math.round(maxGFA * 0.35 / 150),
      estimatedCost: Math.round(maxGFA * 6800),
      projectedRevenue: Math.round(maxGFA * 11500),
      irr: 26.8,
      npv: Math.round(maxGFA * 2800),
      paybackPeriod: 3.8,
      riskLevel: "High"
    }
  ];

  const zoningDetails: ZoningDetails = {
    zoningCode: plot.zoning,
    landUseCategory: plot.zoning.includes('Commercial') ? 'Commercial' : plot.zoning.includes('Mixed') ? 'Mixed-Use' : plot.zoning.includes('Residential') ? 'Residential' : 'Special',
    permittedUses: ["Office", "Retail", "Restaurant", "Hotel", "Residential (upper floors)"],
    conditionalUses: ["Entertainment", "Healthcare", "Educational"],
    maxFAR: maxFAR,
    maxHeight: plot.zoning.includes('Commercial') ? 60 : 45,
    maxCoverage: 70,
    setbacks: { front: 6, rear: 5, side: 4 },
    parkingRequirements: "1 space per 35 sqm GFA for commercial, 1.5 per residential unit",
    buildingCodeNotes: "Saudi Building Code 2024 compliance required. Seismic Zone 2B design standards apply."
  };

  const marketData: MarketData = {
    demandDrivers: ["Vision 2030 economic diversification", "Population growth 2.5% annually", "Foreign investment incentives", "Entertainment sector expansion", "Tourism development"],
    comparableTransactions: "Recent Grade A office transactions in the area range from SAR 18,000-24,000/sqm. Retail spaces achieving SAR 2,800-3,500/sqm annually.",
    absorptionRate: "Office: 85,000 sqm/quarter. Retail: 45,000 sqm/quarter. Residential: 2,500 units/quarter.",
    vacancyRate: "Office: 12%. Retail: 8%. Residential: 6%.",
    averageRent: "Office: SAR 1,800/sqm/year. Retail: SAR 3,200/sqm/year. Residential: SAR 850/sqm/year.",
    capRate: "Office: 7.5%. Retail: 8.2%. Residential: 6.8%.",
    marketTrends: "Strong demand driven by corporate relocations to Riyadh. Premium developments outperforming market averages by 15-20%."
  };

  const spaceProgram: SpaceProgram = {
    totalGFA: Math.round(maxGFA * 0.8),
    buildableArea: Math.round(plotSize * 0.7),
    efficiency: 78,
    floors: Math.min(Math.round(maxGFA * 0.8 / (plotSize * 0.7)), 20),
    components: [
      { use: "Retail (Ground & Podium)", area: Math.round(maxGFA * 0.8 * 0.15), percentage: 15 },
      { use: "Office Space", area: Math.round(maxGFA * 0.8 * 0.45), percentage: 45 },
      { use: "Residential Units", area: Math.round(maxGFA * 0.8 * 0.30), percentage: 30 },
      { use: "Parking & Services", area: Math.round(maxGFA * 0.8 * 0.10), percentage: 10 }
    ]
  };

  const financialSummary: FinancialSummary = {
    landValue: plot.marketValue || plotSize * 4500,
    hardCosts: Math.round(maxGFA * 0.8 * 4200),
    softCosts: Math.round(maxGFA * 0.8 * 650),
    totalDevelopmentCost: (plot.marketValue || plotSize * 4500) + Math.round(maxGFA * 0.8 * 4850),
    debtFinancing: Math.round(((plot.marketValue || plotSize * 4500) + Math.round(maxGFA * 0.8 * 4850)) * 0.65),
    equityRequired: Math.round(((plot.marketValue || plotSize * 4500) + Math.round(maxGFA * 0.8 * 4850)) * 0.35),
    projectedNOI: Math.round(maxGFA * 0.8 * 1450),
    stabilizedValue: Math.round(maxGFA * 0.8 * 1450 / 0.075),
    developmentMargin: 48.5,
    returnOnCost: 11.8
  };

  const riskFactors: string[] = [
    "Market absorption risk if economic growth slows below projected rates",
    "Construction cost escalation due to material price volatility",
    "Regulatory changes affecting development approvals or building codes",
    "Competition from new supply entering the market",
    "Interest rate fluctuations affecting financing costs",
    "Tenant concentration risk in commercial components"
  ];

  return {
    id: `study-${plotId}`,
    plotId: plotId,
    createdAt: new Date(),
    executiveSummary: `This Highest and Best Use analysis evaluates the development potential of the ${plotSize.toLocaleString()} sqm site located at ${plot.address}. Current zoning (${plot.zoning}) permits mixed-use development with a maximum FAR of ${maxFAR}, enabling up to ${maxGFA.toLocaleString()} sqm of gross floor area.\n\nBased on comprehensive market analysis and financial modeling, the recommended development approach is Scenario 2: Balanced Development, which optimizes risk-adjusted returns while aligning with Riyadh's Vision 2030 urban growth objectives. This scenario projects an IRR of 21.2% with a development margin of 48.5%.\n\nThe site benefits from excellent accessibility, strong demographic fundamentals, and growing institutional demand. Subject to detailed feasibility and regulatory approvals, development should commence within 18-24 months to capitalize on current market momentum.`,
    zoningDetails,
    marketData,
    scenarios,
    recommendedScenario: "Scenario 2: Balanced Development - Optimal risk-adjusted returns with diversified income streams",
    spaceProgram,
    financialSummary,
    riskFactors,
    conclusion: `Based on this analysis, we recommend proceeding with Scenario 2: Balanced Development. Next steps include: 1) Engage municipal authorities for preliminary planning consultation, 2) Commission detailed geotechnical and environmental studies, 3) Develop schematic design with certified architects, 4) Secure financing commitments from institutional lenders, 5) Prepare detailed financial model for investor presentation.`
  };
}

const studiesMap = new Map<string, HbuStudy>();
staticPlots.forEach(plot => {
  studiesMap.set(plot.id, generateHbuStudy(plot.id, plot));
});

export function getStudyForPlot(plotId: string): HbuStudy | undefined {
  return studiesMap.get(plotId);
}
