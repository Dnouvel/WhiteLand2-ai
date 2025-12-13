import OpenAI from "openai";
import type { Plot } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  setbacks: {
    front: number;
    rear: number;
    side: number;
  };
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
  components: {
    use: string;
    area: number;
    percentage: number;
  }[];
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

export interface HbuAnalysis {
  executiveSummary: string;
  zoningDetails: ZoningDetails;
  marketData: MarketData;
  scenarios: DevelopmentScenario[];
  recommendedScenario: string;
  spaceProgram: SpaceProgram;
  financialSummary: FinancialSummary;
  riskFactors: string[];
  conclusion: string;
}

function formatMarketValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'Not available';
  }
  return `$${value.toLocaleString()}`;
}

export async function generateHbuStudy(plot: Plot): Promise<HbuAnalysis> {
  const prompt = `You are a senior real estate development consultant specializing in Highest and Best Use (HBU) studies for the Middle East market, particularly Saudi Arabia. Analyze the following property and provide a comprehensive, institutional-grade HBU analysis.

PROPERTY DETAILS:
- Address: ${plot.address}
- Parcel Number: ${plot.parcelNumber}
- Coordinates: ${plot.latitude}, ${plot.longitude}
- Plot Size: ${plot.size} acres (${(plot.size * 4046.86).toFixed(0)} sqm)
- Current Zoning: ${plot.zoning}
- Current Use: ${plot.currentUse}
- Estimated Market Value: ${formatMarketValue(plot.marketValue)}
- Owner: ${plot.ownerName || 'Not available'}

Provide a detailed HBU analysis in JSON format with the following structure:

{
  "executiveSummary": "2-3 paragraphs summarizing the highest and best use recommendation, key findings, and investment thesis",
  
  "zoningDetails": {
    "zoningCode": "Current zoning classification code",
    "landUseCategory": "Residential/Commercial/Mixed-Use/Industrial",
    "permittedUses": ["List of permitted uses under current zoning"],
    "conditionalUses": ["Uses requiring special permits"],
    "maxFAR": 3.5,
    "maxHeight": 45,
    "maxCoverage": 70,
    "setbacks": { "front": 5, "rear": 6, "side": 3 },
    "parkingRequirements": "1 space per 50 sqm GFA for commercial",
    "buildingCodeNotes": "Key building code requirements and restrictions"
  },
  
  "marketData": {
    "demandDrivers": ["Vision 2030 initiatives", "Population growth", "Economic diversification"],
    "comparableTransactions": "Recent comparable sales and developments in the area",
    "absorptionRate": "Market absorption rate for similar properties",
    "vacancyRate": "Current vacancy rates by property type",
    "averageRent": "Average rental rates per sqm by use type",
    "capRate": "Prevailing capitalization rates",
    "marketTrends": "Key market trends affecting development potential"
  },
  
  "scenarios": [
    {
      "name": "Scenario 1: Conservative Option",
      "description": "Detailed description of this development scenario",
      "landUse": "Primary land use type",
      "gfa": 15000,
      "units": 120,
      "estimatedCost": 50000000,
      "projectedRevenue": 75000000,
      "irr": 18.5,
      "npv": 12000000,
      "paybackPeriod": 5.2,
      "riskLevel": "Low/Medium/High"
    },
    {
      "name": "Scenario 2: Base Case",
      "description": "...",
      "landUse": "...",
      "gfa": 25000,
      "estimatedCost": 85000000,
      "projectedRevenue": 130000000,
      "irr": 22.0,
      "npv": 25000000,
      "paybackPeriod": 4.5,
      "riskLevel": "Medium"
    },
    {
      "name": "Scenario 3: Aggressive/Optimized",
      "description": "...",
      "landUse": "...",
      "gfa": 35000,
      "estimatedCost": 120000000,
      "projectedRevenue": 200000000,
      "irr": 26.0,
      "npv": 45000000,
      "paybackPeriod": 4.0,
      "riskLevel": "High"
    }
  ],
  
  "recommendedScenario": "Name of recommended scenario with brief justification",
  
  "spaceProgram": {
    "totalGFA": 25000,
    "buildableArea": 18000,
    "efficiency": 72,
    "floors": 12,
    "components": [
      { "use": "Retail", "area": 5000, "percentage": 20 },
      { "use": "Office", "area": 12000, "percentage": 48 },
      { "use": "Residential", "area": 8000, "percentage": 32 }
    ]
  },
  
  "financialSummary": {
    "landValue": 25000000,
    "hardCosts": 45000000,
    "softCosts": 8000000,
    "totalDevelopmentCost": 78000000,
    "debtFinancing": 54600000,
    "equityRequired": 23400000,
    "projectedNOI": 9500000,
    "stabilizedValue": 118750000,
    "developmentMargin": 52.2,
    "returnOnCost": 12.2
  },
  
  "riskFactors": ["List of key risk factors and mitigation strategies"],
  
  "conclusion": "Final recommendation with actionable next steps"
}

IMPORTANT NOTES:
- All monetary values in SAR (Saudi Riyals)
- Heights in meters, areas in square meters
- IRR and percentages as decimal values (e.g., 18.5 for 18.5%)
- Be realistic with Saudi Arabia market conditions and regulations
- Consider Vision 2030 implications and Riyadh's growth trajectory
- Include specific, plausible numbers based on the plot size and location

Respond with valid JSON only.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert real estate development consultant with deep knowledge of Saudi Arabian markets, regulations, and Vision 2030 initiatives. Provide institutional-quality HBU analysis with realistic, data-driven insights. All financial figures should be in Saudi Riyals (SAR). Be specific and quantitative in your analysis.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 8192,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI model");
    }

    const analysis = JSON.parse(content) as HbuAnalysis;
    
    // Validate required fields
    if (!analysis.executiveSummary || !analysis.scenarios || analysis.scenarios.length < 3) {
      throw new Error("Incomplete analysis response from AI");
    }
    
    return analysis;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate HBU analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
