import { Download, Share2, FileText, TrendingUp, DollarSign, Building2, Lightbulb, AlertTriangle, BarChart3, Layers, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { HbuStudy, Plot, DevelopmentScenario, ZoningDetails, MarketData, SpaceProgram, FinancialSummary } from "@shared/schema";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface HbuReportModalProps {
  study: HbuStudy | null;
  plot: Plot | null;
  open: boolean;
  onClose: () => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `SAR ${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `SAR ${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `SAR ${(value / 1000).toFixed(0)}K`;
  }
  return `SAR ${value.toLocaleString()}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'low': return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'high': return 'bg-red-500/10 text-red-700 dark:text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
}

function ScenarioCard({ scenario, isRecommended }: { scenario: DevelopmentScenario; isRecommended: boolean }) {
  return (
    <Card className={`relative ${isRecommended ? 'border-primary border-2' : ''}`}>
      {isRecommended && (
        <div className="absolute -top-3 left-4">
          <Badge className="bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-base font-semibold">{scenario.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{scenario.landUse}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{scenario.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">GFA</p>
            <p className="font-medium">{formatNumber(scenario.gfa)} sqm</p>
          </div>
          {scenario.units && (
            <div>
              <p className="text-muted-foreground">Units</p>
              <p className="font-medium">{scenario.units}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Est. Cost</p>
            <p className="font-medium">{formatCurrency(scenario.estimatedCost)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Revenue</p>
            <p className="font-medium">{formatCurrency(scenario.projectedRevenue)}</p>
          </div>
        </div>

        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">IRR</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{scenario.irr.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">NPV</span>
            <span className="font-medium">{formatCurrency(scenario.npv)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Payback</span>
            <span className="font-medium">{scenario.paybackPeriod.toFixed(1)} years</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Risk Level</span>
            <Badge variant="secondary" className={getRiskColor(scenario.riskLevel)}>
              {scenario.riskLevel}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ZoningSection({ zoning }: { zoning: ZoningDetails }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          Zoning Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Zoning Code</p>
            <p className="font-medium">{zoning.zoningCode}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Land Use Category</p>
            <p className="font-medium">{zoning.landUseCategory}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max FAR</p>
            <p className="font-medium">{zoning.maxFAR}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Height</p>
            <p className="font-medium">{zoning.maxHeight}m</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Max Coverage</p>
            <p className="font-medium">{zoning.maxCoverage}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Front Setback</p>
            <p className="font-medium">{zoning.setbacks.front}m</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rear Setback</p>
            <p className="font-medium">{zoning.setbacks.rear}m</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Side Setback</p>
            <p className="font-medium">{zoning.setbacks.side}m</p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Permitted Uses</p>
            <div className="flex flex-wrap gap-1">
              {zoning.permittedUses.map((use, i) => (
                <Badge key={i} variant="secondary" size="sm">{use}</Badge>
              ))}
            </div>
          </div>
          {zoning.conditionalUses.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Conditional Uses</p>
              <div className="flex flex-wrap gap-1">
                {zoning.conditionalUses.map((use, i) => (
                  <Badge key={i} variant="outline" size="sm">{use}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 space-y-2 text-sm">
          <p><span className="text-muted-foreground">Parking:</span> {zoning.parkingRequirements}</p>
          <p><span className="text-muted-foreground">Building Code:</span> {zoning.buildingCodeNotes}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketSection({ market }: { market: MarketData }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          Market Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Demand Drivers</p>
          <div className="flex flex-wrap gap-1">
            {market.demandDrivers.map((driver, i) => (
              <Badge key={i} variant="secondary" size="sm">{driver}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Vacancy Rate</p>
            <p className="font-medium">{market.vacancyRate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Rent</p>
            <p className="font-medium">{market.averageRent}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cap Rate</p>
            <p className="font-medium">{market.capRate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Absorption</p>
            <p className="font-medium">{market.absorptionRate}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Comparables:</span> {market.comparableTransactions}</p>
          <p><span className="text-muted-foreground">Market Trends:</span> {market.marketTrends}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SpaceProgramSection({ program }: { program: SpaceProgram }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="h-5 w-5 text-muted-foreground" />
          Space Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total GFA</p>
            <p className="font-medium">{formatNumber(program.totalGFA)} sqm</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Buildable Area</p>
            <p className="font-medium">{formatNumber(program.buildableArea)} sqm</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Efficiency</p>
            <p className="font-medium">{program.efficiency}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Floors</p>
            <p className="font-medium">{program.floors}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Component Breakdown</p>
          {program.components.map((comp, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{comp.use}</span>
                <span className="text-muted-foreground">{formatNumber(comp.area)} sqm ({comp.percentage}%)</span>
              </div>
              <Progress value={comp.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FinancialSection({ financial }: { financial: FinancialSummary }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Development Costs</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Land Value</span>
                <span className="font-medium">{formatCurrency(financial.landValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Hard Costs</span>
                <span className="font-medium">{formatCurrency(financial.hardCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Soft Costs</span>
                <span className="font-medium">{formatCurrency(financial.softCosts)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium">Total Dev. Cost</span>
                <span className="font-semibold">{formatCurrency(financial.totalDevelopmentCost)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Capital Structure</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Debt Financing</span>
                <span className="font-medium">{formatCurrency(financial.debtFinancing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Equity Required</span>
                <span className="font-medium">{formatCurrency(financial.equityRequired)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Returns</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Projected NOI</span>
                <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(financial.projectedNOI)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Stabilized Value</span>
                <span className="font-medium">{formatCurrency(financial.stabilizedValue)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Key Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Development Margin</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{financial.developmentMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Return on Cost</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{financial.returnOnCost.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskSection({ risks }: { risks: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          Risk Factors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {risks.map((risk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-600 dark:text-yellow-400 mt-1">
                <AlertTriangle className="h-4 w-4" />
              </span>
              {risk}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function HbuReportModal({ study, plot, open, onClose }: HbuReportModalProps) {
  const { toast } = useToast();

  const handleExportPDF = () => {
    if (!study || !plot) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    const col1 = margin;
    const col2 = margin + 45;
    const col3 = margin + 90;
    const col4 = margin + 135;
    let yPos = margin;

    const checkPage = (needed: number = 20) => {
      if (yPos > 280 - needed) {
        doc.addPage();
        yPos = margin;
      }
    };

    const addSectionHeader = (title: string) => {
      checkPage(30);
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 4, contentWidth, 10, 'F');
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 2, yPos + 2);
      yPos += 12;
    };

    const addSubHeader = (title: string) => {
      checkPage(15);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, yPos);
      yPos += 6;
    };

    const addRow = (label: string, value: string, x: number = margin) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(label, x, yPos);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(value, x, yPos + 4);
      doc.setFont("helvetica", "normal");
    };

    const addText = (text: string) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        checkPage(5);
        doc.text(line, margin, yPos);
        yPos += 4;
      });
    };

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Highest & Best Use Study", margin, yPos);
    yPos += 12;

    // Property Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Property: ${plot.address}`, margin, yPos);
    yPos += 5;
    doc.text(`Parcel: ${plot.parcelNumber} | Size: ${plot.size.toFixed(2)} acres | Zoning: ${plot.zoning}`, margin, yPos);
    yPos += 5;
    const createdDate = study.createdAt ? new Date(study.createdAt) : new Date();
    doc.text(`Generated: ${createdDate.toLocaleDateString()} at ${createdDate.toLocaleTimeString()}`, margin, yPos);
    yPos += 12;

    // Executive Summary
    addSectionHeader("EXECUTIVE SUMMARY");
    addText(study.executiveSummary);
    yPos += 8;

    // 1. SCENARIOS TAB
    if (study.scenarios && study.scenarios.length > 0) {
      addSectionHeader("1. DEVELOPMENT SCENARIOS");
      
      if (study.recommendedScenario) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(0, 100, 0);
        doc.text(`Recommendation: ${study.recommendedScenario}`, margin, yPos);
        doc.setTextColor(0);
        yPos += 8;
      }

      study.scenarios.forEach((scenario, index) => {
        checkPage(45);
        
        // Scenario header with background
        const isRecommended = study.recommendedScenario?.includes(scenario.name);
        if (isRecommended) {
          doc.setFillColor(220, 252, 231);
        } else {
          doc.setFillColor(248, 248, 248);
        }
        doc.rect(margin, yPos - 4, contentWidth, 8, 'F');
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${scenario.name}${isRecommended ? ' [RECOMMENDED]' : ''}`, margin + 2, yPos + 1);
        yPos += 10;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Land Use: ${scenario.landUse}`, margin, yPos);
        yPos += 5;

        const descLines = doc.splitTextToSize(scenario.description, contentWidth);
        descLines.slice(0, 2).forEach((line: string) => {
          doc.text(line, margin, yPos);
          yPos += 4;
        });
        yPos += 2;

        // Metrics table
        addRow("GFA", `${scenario.gfa.toLocaleString()} sqm`, col1);
        addRow("Units", scenario.units ? `${scenario.units}` : "N/A", col2);
        addRow("Est. Cost", formatCurrency(scenario.estimatedCost), col3);
        addRow("Revenue", formatCurrency(scenario.projectedRevenue), col4);
        yPos += 12;

        addRow("IRR", `${scenario.irr.toFixed(1)}%`, col1);
        addRow("NPV", formatCurrency(scenario.npv), col2);
        addRow("Payback", `${scenario.paybackPeriod.toFixed(1)} years`, col3);
        addRow("Risk", scenario.riskLevel, col4);
        yPos += 14;
      });
      yPos += 4;
    }

    // 2. ZONING TAB
    if (study.zoningDetails) {
      addSectionHeader("2. ZONING DETAILS");
      const z = study.zoningDetails;

      addRow("Zoning Code", z.zoningCode, col1);
      addRow("Land Use Category", z.landUseCategory, col2);
      addRow("Max FAR", `${z.maxFAR}`, col3);
      addRow("Max Height", `${z.maxHeight}m`, col4);
      yPos += 12;

      addRow("Max Coverage", `${z.maxCoverage}%`, col1);
      addRow("Front Setback", `${z.setbacks.front}m`, col2);
      addRow("Rear Setback", `${z.setbacks.rear}m`, col3);
      addRow("Side Setback", `${z.setbacks.side}m`, col4);
      yPos += 12;

      addSubHeader("Permitted Uses:");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(z.permittedUses.join(", "), margin, yPos);
      yPos += 6;

      if (z.conditionalUses.length > 0) {
        addSubHeader("Conditional Uses:");
        doc.setFont("helvetica", "normal");
        doc.text(z.conditionalUses.join(", "), margin, yPos);
        yPos += 6;
      }

      addSubHeader("Parking Requirements:");
      addText(z.parkingRequirements);
      yPos += 2;

      addSubHeader("Building Code Notes:");
      addText(z.buildingCodeNotes);
      yPos += 6;
    }

    // 3. MARKET TAB
    if (study.marketData) {
      addSectionHeader("3. MARKET ANALYSIS");
      const m = study.marketData;

      addSubHeader("Demand Drivers:");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const driversText = doc.splitTextToSize(m.demandDrivers.join(", "), contentWidth);
      driversText.forEach((line: string) => {
        checkPage(5);
        doc.text(line, margin, yPos);
        yPos += 4;
      });
      yPos += 4;

      // Market metrics in proper table format
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 3, contentWidth, 6, 'F');
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Metric", margin + 2, yPos);
      doc.text("Value", margin + 55, yPos);
      yPos += 7;

      const marketMetrics = [
        { label: "Vacancy Rate", value: m.vacancyRate },
        { label: "Average Rent", value: m.averageRent },
        { label: "Cap Rate", value: m.capRate },
        { label: "Absorption Rate", value: m.absorptionRate },
      ];

      doc.setFont("helvetica", "normal");
      marketMetrics.forEach((metric) => {
        checkPage(6);
        doc.text(metric.label, margin + 2, yPos);
        const valueLines = doc.splitTextToSize(metric.value, contentWidth - 60);
        valueLines.forEach((line: string, idx: number) => {
          if (idx > 0) {
            checkPage(4);
            yPos += 4;
          }
          doc.text(line, margin + 55, yPos);
        });
        yPos += 5;
      });
      yPos += 4;

      addSubHeader("Comparable Transactions:");
      addText(m.comparableTransactions);
      yPos += 2;

      addSubHeader("Market Trends:");
      addText(m.marketTrends);
      yPos += 6;
    }

    // 4. PROGRAM TAB
    if (study.spaceProgram) {
      addSectionHeader("4. SPACE PROGRAM");
      const p = study.spaceProgram;

      addRow("Total GFA", `${p.totalGFA.toLocaleString()} sqm`, col1);
      addRow("Buildable Area", `${p.buildableArea.toLocaleString()} sqm`, col2);
      addRow("Efficiency", `${p.efficiency}%`, col3);
      addRow("Floors", `${p.floors}`, col4);
      yPos += 14;

      addSubHeader("Component Breakdown:");
      yPos += 2;
      
      // Table header
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, yPos - 3, contentWidth, 6, 'F');
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Use", col1, yPos);
      doc.text("Area (sqm)", col2, yPos);
      doc.text("Percentage", col3, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      p.components.forEach((comp) => {
        checkPage(6);
        doc.text(comp.use, col1, yPos);
        doc.text(comp.area.toLocaleString(), col2, yPos);
        doc.text(`${comp.percentage}%`, col3, yPos);
        yPos += 5;
      });
      yPos += 6;
    }

    // 5. FINANCIAL TAB
    if (study.financialSummary) {
      addSectionHeader("5. FINANCIAL SUMMARY");
      const f = study.financialSummary;

      addSubHeader("Development Costs:");
      yPos += 2;
      
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, yPos - 3, 80, 6, 'F');
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Cost Item", col1, yPos);
      doc.text("Amount (SAR)", col2, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.text("Land Value", col1, yPos);
      doc.text(formatCurrency(f.landValue), col2, yPos);
      yPos += 5;
      doc.text("Hard Costs", col1, yPos);
      doc.text(formatCurrency(f.hardCosts), col2, yPos);
      yPos += 5;
      doc.text("Soft Costs", col1, yPos);
      doc.text(formatCurrency(f.softCosts), col2, yPos);
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Total Development Cost", col1, yPos);
      doc.text(formatCurrency(f.totalDevelopmentCost), col2, yPos);
      yPos += 10;

      addSubHeader("Capital Structure:");
      doc.setFont("helvetica", "normal");
      doc.text("Debt Financing", col1, yPos);
      doc.text(formatCurrency(f.debtFinancing), col2, yPos);
      yPos += 5;
      doc.text("Equity Required", col1, yPos);
      doc.text(formatCurrency(f.equityRequired), col2, yPos);
      yPos += 10;

      addSubHeader("Returns:");
      doc.setFont("helvetica", "normal");
      doc.text("Projected NOI", col1, yPos);
      doc.setTextColor(0, 128, 0);
      doc.text(formatCurrency(f.projectedNOI), col2, yPos);
      doc.setTextColor(0);
      yPos += 5;
      doc.text("Stabilized Value", col1, yPos);
      doc.text(formatCurrency(f.stabilizedValue), col2, yPos);
      yPos += 10;

      addSubHeader("Key Metrics:");
      doc.setFont("helvetica", "bold");
      doc.text("Development Margin", col1, yPos);
      doc.setTextColor(0, 128, 0);
      doc.text(`${f.developmentMargin.toFixed(1)}%`, col2, yPos);
      doc.setTextColor(0);
      yPos += 5;
      doc.text("Return on Cost", col1, yPos);
      doc.setTextColor(0, 128, 0);
      doc.text(`${f.returnOnCost.toFixed(1)}%`, col2, yPos);
      doc.setTextColor(0);
      yPos += 10;
    }

    // Risk Factors
    if (study.riskFactors && study.riskFactors.length > 0) {
      addSectionHeader("RISK FACTORS");
      study.riskFactors.forEach((risk, i) => {
        checkPage(8);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`${i + 1}. ${risk}`, margin, yPos);
        yPos += 5;
      });
      yPos += 4;
    }

    // Conclusion
    if (study.conclusion) {
      addSectionHeader("CONCLUSION & NEXT STEPS");
      addText(study.conclusion);
    }

    doc.save(`HBU-Study-${plot.parcelNumber}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Your comprehensive HBU study has been downloaded.",
    });
  };

  const handleCopyText = async () => {
    if (!study || !plot) return;

    let text = `HIGHEST & BEST USE STUDY
========================

Property: ${plot.address}
Parcel: ${plot.parcelNumber} | Size: ${plot.size.toFixed(2)} acres | Zoning: ${plot.zoning}
Date: ${new Date(study.createdAt).toLocaleDateString()}

EXECUTIVE SUMMARY
-----------------
${study.executiveSummary}
`;

    // 1. SCENARIOS
    if (study.scenarios && study.scenarios.length > 0) {
      text += `

1. DEVELOPMENT SCENARIOS
------------------------
${study.recommendedScenario ? `Recommendation: ${study.recommendedScenario}\n` : ''}`;
      study.scenarios.forEach((scenario, i) => {
        const isRec = study.recommendedScenario?.includes(scenario.name) ? ' [RECOMMENDED]' : '';
        text += `
${scenario.name}${isRec}
  Land Use: ${scenario.landUse}
  Description: ${scenario.description}
  
  GFA: ${scenario.gfa.toLocaleString()} sqm | Units: ${scenario.units || 'N/A'}
  Est. Cost: ${formatCurrency(scenario.estimatedCost)} | Revenue: ${formatCurrency(scenario.projectedRevenue)}
  IRR: ${scenario.irr.toFixed(1)}% | NPV: ${formatCurrency(scenario.npv)}
  Payback: ${scenario.paybackPeriod.toFixed(1)} years | Risk: ${scenario.riskLevel}
`;
      });
    }

    // 2. ZONING
    if (study.zoningDetails) {
      const z = study.zoningDetails;
      text += `

2. ZONING DETAILS
-----------------
Zoning Code: ${z.zoningCode} | Land Use Category: ${z.landUseCategory}
Max FAR: ${z.maxFAR} | Max Height: ${z.maxHeight}m | Max Coverage: ${z.maxCoverage}%
Setbacks: Front ${z.setbacks.front}m | Rear ${z.setbacks.rear}m | Side ${z.setbacks.side}m

Permitted Uses: ${z.permittedUses.join(', ')}
${z.conditionalUses.length > 0 ? `Conditional Uses: ${z.conditionalUses.join(', ')}` : ''}

Parking: ${z.parkingRequirements}
Building Code: ${z.buildingCodeNotes}
`;
    }

    // 3. MARKET
    if (study.marketData) {
      const m = study.marketData;
      text += `

3. MARKET ANALYSIS
------------------
Demand Drivers: ${m.demandDrivers.join(', ')}

Vacancy Rate: ${m.vacancyRate} | Average Rent: ${m.averageRent}
Cap Rate: ${m.capRate} | Absorption: ${m.absorptionRate}

Comparables: ${m.comparableTransactions}
Market Trends: ${m.marketTrends}
`;
    }

    // 4. SPACE PROGRAM
    if (study.spaceProgram) {
      const p = study.spaceProgram;
      text += `

4. SPACE PROGRAM
----------------
Total GFA: ${p.totalGFA.toLocaleString()} sqm | Buildable Area: ${p.buildableArea.toLocaleString()} sqm
Efficiency: ${p.efficiency}% | Floors: ${p.floors}

Component Breakdown:
`;
      p.components.forEach((comp) => {
        text += `  - ${comp.use}: ${comp.area.toLocaleString()} sqm (${comp.percentage}%)\n`;
      });
    }

    // 5. FINANCIAL
    if (study.financialSummary) {
      const f = study.financialSummary;
      text += `

5. FINANCIAL SUMMARY
--------------------
Development Costs:
  Land Value: ${formatCurrency(f.landValue)}
  Hard Costs: ${formatCurrency(f.hardCosts)}
  Soft Costs: ${formatCurrency(f.softCosts)}
  Total Development Cost: ${formatCurrency(f.totalDevelopmentCost)}

Capital Structure:
  Debt Financing: ${formatCurrency(f.debtFinancing)}
  Equity Required: ${formatCurrency(f.equityRequired)}

Returns:
  Projected NOI: ${formatCurrency(f.projectedNOI)}
  Stabilized Value: ${formatCurrency(f.stabilizedValue)}

Key Metrics:
  Development Margin: ${f.developmentMargin.toFixed(1)}%
  Return on Cost: ${f.returnOnCost.toFixed(1)}%
`;
    }

    // RISK FACTORS
    if (study.riskFactors && study.riskFactors.length > 0) {
      text += `

RISK FACTORS
------------
`;
      study.riskFactors.forEach((risk, i) => {
        text += `${i + 1}. ${risk}\n`;
      });
    }

    // CONCLUSION
    if (study.conclusion) {
      text += `

CONCLUSION & NEXT STEPS
-----------------------
${study.conclusion}
`;
    }

    await navigator.clipboard.writeText(text.trim());
    
    toast({
      title: "Copied to Clipboard",
      description: "The comprehensive report has been copied.",
    });
  };

  if (!study || !plot) return null;

  const hasEnhancedData = study.scenarios && study.scenarios.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate">
                HBU Study - {plot.address}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Generated {new Date(study.createdAt).toLocaleDateString()} at {new Date(study.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyText}
                data-testid="button-copy-report"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button 
                size="sm" 
                onClick={handleExportPDF}
                data-testid="button-export-pdf"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary">{plot.zoning}</Badge>
              <Badge variant="outline">{plot.currentUse}</Badge>
              <Badge variant="outline">{plot.size.toLocaleString()} sqm</Badge>
              {plot.marketValue && (
                <Badge variant="outline">SAR {(plot.marketValue / 1000000).toFixed(2)}M</Badge>
              )}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid="text-executive-summary">
                  {study.executiveSummary}
                </p>
              </CardContent>
            </Card>

            {hasEnhancedData ? (
              <Tabs defaultValue="scenarios" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="scenarios" data-testid="tab-scenarios">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Scenarios
                  </TabsTrigger>
                  <TabsTrigger value="zoning" data-testid="tab-zoning">
                    <Building2 className="h-4 w-4 mr-2" />
                    Zoning
                  </TabsTrigger>
                  <TabsTrigger value="market" data-testid="tab-market">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Market
                  </TabsTrigger>
                  <TabsTrigger value="program" data-testid="tab-program">
                    <Layers className="h-4 w-4 mr-2" />
                    Program
                  </TabsTrigger>
                  <TabsTrigger value="financial" data-testid="tab-financial">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Financial
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="scenarios" className="mt-6 space-y-6">
                  {study.recommendedScenario && (
                    <Card className="bg-green-500/5 border-green-500/20">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="font-medium">Recommendation:</span>
                          <span className="text-sm">{study.recommendedScenario}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {study.scenarios?.map((scenario, i) => (
                      <ScenarioCard 
                        key={i} 
                        scenario={scenario} 
                        isRecommended={study.recommendedScenario?.includes(scenario.name) || false}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="zoning" className="mt-6">
                  {study.zoningDetails && <ZoningSection zoning={study.zoningDetails} />}
                </TabsContent>

                <TabsContent value="market" className="mt-6">
                  {study.marketData && <MarketSection market={study.marketData} />}
                </TabsContent>

                <TabsContent value="program" className="mt-6">
                  {study.spaceProgram && <SpaceProgramSection program={study.spaceProgram} />}
                </TabsContent>

                <TabsContent value="financial" className="mt-6 space-y-6">
                  {study.financialSummary && <FinancialSection financial={study.financialSummary} />}
                  {study.riskFactors && study.riskFactors.length > 0 && (
                    <RiskSection risks={study.riskFactors} />
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  <p>Detailed analysis data not available for this study.</p>
                </CardContent>
              </Card>
            )}

            {study.conclusion && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-muted-foreground" />
                    Conclusion & Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid="text-conclusion">
                    {study.conclusion}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
