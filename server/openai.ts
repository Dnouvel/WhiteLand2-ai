import OpenAI from "openai";
import type { Plot } from "@shared/schema";

// Using gpt-4o model for HBU analysis
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface HbuAnalysis {
  executiveSummary: string;
  zoningAnalysis: string;
  marketDemand: string;
  financialFeasibility: string;
  developmentRecommendations: string;
}

function formatMarketValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'Not available';
  }
  return `$${value.toLocaleString()}`;
}

export async function generateHbuStudy(plot: Plot): Promise<HbuAnalysis> {
  const prompt = `You are a real estate analyst specializing in Highest and Best Use (HBU) studies. Analyze the following property and provide a comprehensive HBU analysis.

Property Details:
- Address: ${plot.address}
- Parcel Number: ${plot.parcelNumber}
- Location: ${plot.latitude}, ${plot.longitude}
- Lot Size: ${plot.size} acres
- Current Zoning: ${plot.zoning}
- Current Use: ${plot.currentUse}
- Estimated Market Value: ${formatMarketValue(plot.marketValue)}
- Owner: ${plot.ownerName || 'Not available'}

Provide a detailed HBU analysis in JSON format with the following sections:
1. executiveSummary: A concise 2-3 paragraph summary of the property's highest and best use potential
2. zoningAnalysis: Analysis of current zoning regulations, permitted uses, restrictions, and potential variances
3. marketDemand: Assessment of current market conditions, demand drivers, comparable properties, and absorption rates
4. financialFeasibility: Financial analysis including development costs, potential returns, cap rates, and investment considerations
5. developmentRecommendations: Specific recommendations for optimal development, including phasing, design considerations, and risk factors

Respond with JSON only.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert real estate analyst providing HBU studies. Respond with detailed, professional analysis in JSON format. Each section should be 2-4 paragraphs of substantive content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4096,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI model");
    }

    const analysis = JSON.parse(content) as HbuAnalysis;
    
    // Validate required fields
    if (!analysis.executiveSummary || !analysis.zoningAnalysis || 
        !analysis.marketDemand || !analysis.financialFeasibility || 
        !analysis.developmentRecommendations) {
      throw new Error("Incomplete analysis response from AI");
    }
    
    return analysis;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate HBU analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
