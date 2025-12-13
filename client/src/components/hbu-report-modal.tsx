import { X, Download, Share2, Bookmark, FileText, TrendingUp, DollarSign, Building2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HbuStudy, Plot } from "@shared/schema";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface HbuReportModalProps {
  study: HbuStudy | null;
  plot: Plot | null;
  open: boolean;
  onClose: () => void;
}

function ReportSection({ 
  title, 
  content, 
  icon: Icon 
}: { 
  title: string; 
  content: string; 
  icon: typeof FileText;
}) {
  return (
    <Card className="border-card-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
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

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Highest & Best Use Study", margin, yPos);
    yPos += 10;

    // Property info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Property: ${plot.address}`, margin, yPos);
    yPos += 6;
    doc.text(`Parcel: ${plot.parcelNumber}`, margin, yPos);
    yPos += 6;
    const createdDate = study.createdAt ? new Date(study.createdAt) : new Date();
    doc.text(`Date: ${createdDate.toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    // Sections
    const sections = [
      { title: "Executive Summary", content: study.executiveSummary },
      { title: "Zoning Analysis", content: study.zoningAnalysis },
      { title: "Market Demand Assessment", content: study.marketDemand },
      { title: "Financial Feasibility", content: study.financialFeasibility },
      { title: "Development Recommendations", content: study.developmentRecommendations },
    ];

    sections.forEach((section) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(section.title, margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(section.content, contentWidth);
      
      lines.forEach((line: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 10;
    });

    doc.save(`HBU-Study-${plot.parcelNumber}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Your HBU study has been downloaded.",
    });
  };

  const handleCopyText = async () => {
    if (!study || !plot) return;

    const text = `
HIGHEST & BEST USE STUDY
========================

Property: ${plot.address}
Parcel: ${plot.parcelNumber}
Date: ${new Date(study.createdAt).toLocaleDateString()}

EXECUTIVE SUMMARY
-----------------
${study.executiveSummary}

ZONING ANALYSIS
---------------
${study.zoningAnalysis}

MARKET DEMAND ASSESSMENT
------------------------
${study.marketDemand}

FINANCIAL FEASIBILITY
---------------------
${study.financialFeasibility}

DEVELOPMENT RECOMMENDATIONS
---------------------------
${study.developmentRecommendations}
    `.trim();

    await navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to Clipboard",
      description: "The full report has been copied.",
    });
  };

  if (!study || !plot) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
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
            {/* Property Summary */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary">{plot.zoning}</Badge>
              <Badge variant="outline">{plot.currentUse}</Badge>
              <Badge variant="outline">{plot.size.toFixed(2)} acres</Badge>
              {plot.marketValue && (
                <Badge variant="outline">${(plot.marketValue / 1000000).toFixed(2)}M</Badge>
              )}
            </div>

            {/* Executive Summary - Highlighted */}
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

            <div className="grid gap-6 md:grid-cols-2">
              <ReportSection 
                title="Zoning Analysis" 
                content={study.zoningAnalysis}
                icon={Building2}
              />
              <ReportSection 
                title="Market Demand" 
                content={study.marketDemand}
                icon={TrendingUp}
              />
            </div>

            <ReportSection 
              title="Financial Feasibility" 
              content={study.financialFeasibility}
              icon={DollarSign}
            />

            <ReportSection 
              title="Development Recommendations" 
              content={study.developmentRecommendations}
              icon={Lightbulb}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
