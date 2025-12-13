import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateHbuStudy } from "./openai";
import { z } from "zod";

const hbuStudyRequestSchema = z.object({
  plotId: z.string(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all plots
  app.get("/api/plots", async (_req, res) => {
    try {
      const plots = await storage.getAllPlots();
      res.json(plots);
    } catch (error) {
      console.error("Error fetching plots:", error);
      res.status(500).json({ error: "Failed to fetch plots" });
    }
  });

  // Get single plot
  app.get("/api/plots/:id", async (req, res) => {
    try {
      const plot = await storage.getPlot(req.params.id);
      if (!plot) {
        return res.status(404).json({ error: "Plot not found" });
      }
      res.json(plot);
    } catch (error) {
      console.error("Error fetching plot:", error);
      res.status(500).json({ error: "Failed to fetch plot" });
    }
  });

  // Get studies for a plot
  app.get("/api/plots/:id/studies", async (req, res) => {
    try {
      const studies = await storage.getStudiesForPlot(req.params.id);
      res.json(studies);
    } catch (error) {
      console.error("Error fetching studies:", error);
      res.status(500).json({ error: "Failed to fetch studies" });
    }
  });

  // Generate new HBU study
  app.post("/api/hbu-studies", async (req, res) => {
    try {
      const body = hbuStudyRequestSchema.parse(req.body);
      
      const plot = await storage.getPlot(body.plotId);
      if (!plot) {
        return res.status(404).json({ error: "Plot not found" });
      }

      // Generate HBU analysis using OpenAI
      const analysis = await generateHbuStudy(plot);

      // Save the study
      const study = await storage.createStudy({
        plotId: body.plotId,
        executiveSummary: analysis.executiveSummary,
        zoningDetails: analysis.zoningDetails,
        marketData: analysis.marketData,
        scenarios: analysis.scenarios,
        recommendedScenario: analysis.recommendedScenario,
        spaceProgram: analysis.spaceProgram,
        financialSummary: analysis.financialSummary,
        riskFactors: analysis.riskFactors,
        conclusion: analysis.conclusion,
      });

      res.json({ study });
    } catch (error) {
      console.error("Error generating HBU study:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request body", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate HBU study" });
    }
  });

  // Get single study
  app.get("/api/hbu-studies/:id", async (req, res) => {
    try {
      const study = await storage.getStudy(req.params.id);
      if (!study) {
        return res.status(404).json({ error: "Study not found" });
      }
      res.json(study);
    } catch (error) {
      console.error("Error fetching study:", error);
      res.status(500).json({ error: "Failed to fetch study" });
    }
  });

  return httpServer;
}
