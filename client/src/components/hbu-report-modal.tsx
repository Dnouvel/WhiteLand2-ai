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
    let yPos = margin;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Highest & Best Use Study", margin, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Property: ${plot.address}`, margin, yPos);
    yPos += 6;
    doc.text(`Parcel: ${plot.parcelNumber}`, margin, yPos);
    yPos += 6;
    const createdDate = study.createdAt ? new Date(study.createdAt) : new Date();
    doc.text(`Date: ${createdDate.toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(study.executiveSummary, contentWidth);
    summaryLines.forEach((line: string) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 10;

    if (study.scenarios && study.scenarios.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = margin;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Development Scenarios", margin, yPos);
      yPos += 8;

      study.scenarios.forEach((scenario, index) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = margin;
        }
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${scenario.name}`, margin, yPos);
        yPos += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Land Use: ${scenario.landUse} | GFA: ${scenario.gfa.toLocaleString()} sqm`, margin, yPos);
        yPos += 5;
        doc.text(`Cost: SAR ${(scenario.estimatedCost / 1000000).toFixed(1)}M | Revenue: SAR ${(scenario.projectedRevenue / 1000000).toFixed(1)}M`, margin, yPos);
        yPos += 5;
        doc.text(`IRR: ${scenario.irr.toFixed(1)}% | NPV: SAR ${(scenario.npv / 1000000).toFixed(1)}M | Risk: ${scenario.riskLevel}`, margin, yPos);
        yPos += 8;
      });
    }

    if (study.conclusion) {
      if (yPos > 250) {
        doc.addPage();
        yPos = margin;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Conclusion", margin, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const conclusionLines = doc.splitTextToSize(study.conclusion, contentWidth);
      conclusionLines.forEach((line: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 5;
      });
    }

    doc.save(`HBU-Study-${plot.parcelNumber}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Your HBU study has been downloaded.",
    });
  };

  const handleCopyText = async () => {
    if (!study || !plot) return;

    let text = `HIGHEST & BEST USE STUDY
========================

Property: ${plot.address}
Parcel: ${plot.parcelNumber}
Date: ${new Date(study.createdAt).toLocaleDateString()}

EXECUTIVE SUMMARY
-----------------
${study.executiveSummary}
`;

    if (study.scenarios && study.scenarios.length > 0) {
      text += `
DEVELOPMENT SCENARIOS
---------------------
`;
      study.scenarios.forEach((scenario, i) => {
        text += `
${i + 1}. ${scenario.name}
   Land Use: ${scenario.landUse}
   GFA: ${scenario.gfa.toLocaleString()} sqm
   Cost: SAR ${(scenario.estimatedCost / 1000000).toFixed(1)}M
   Revenue: SAR ${(scenario.projectedRevenue / 1000000).toFixed(1)}M
   IRR: ${scenario.irr.toFixed(1)}%
   NPV: SAR ${(scenario.npv / 1000000).toFixed(1)}M
   Risk Level: ${scenario.riskLevel}
`;
      });
    }

    if (study.recommendedScenario) {
      text += `
RECOMMENDATION
--------------
${study.recommendedScenario}
`;
    }

    if (study.conclusion) {
      text += `
CONCLUSION
----------
${study.conclusion}
`;
    }

    await navigator.clipboard.writeText(text.trim());
    
    toast({
      title: "Copied to Clipboard",
      description: "The full report has been copied.",
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
              <Badge variant="outline">{plot.size.toFixed(2)} acres</Badge>
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
