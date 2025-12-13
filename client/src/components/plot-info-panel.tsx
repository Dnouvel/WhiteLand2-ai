import { MapPin, Maximize2, Building2, DollarSign, User, FileText, Loader2, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Plot } from "@shared/schema";

interface PlotInfoPanelProps {
  plot: Plot | null;
  onGenerateStudy: () => void;
  isGenerating: boolean;
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof MapPin }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <span className="text-lg font-mono font-medium">{value}</span>
    </div>
  );
}

function ZoningBadge({ zoning }: { zoning: string }) {
  const getVariant = (z: string) => {
    if (z.startsWith("R")) return "secondary";
    if (z.startsWith("C")) return "default";
    if (z.startsWith("M")) return "outline";
    return "secondary";
  };

  return (
    <Badge variant={getVariant(zoning)} className="text-xs">
      {zoning}
    </Badge>
  );
}

export function PlotInfoPanel({ 
  plot, 
  onGenerateStudy, 
  isGenerating 
}: PlotInfoPanelProps) {
  if (!plot) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-48 h-32 mb-6 bg-muted/50 rounded-lg flex items-center justify-center">
          <MapPin className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Plot Selected</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Click on any plot on the map to view its details and generate an AI-powered HBU analysis.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold truncate" data-testid="text-plot-address">
                {plot.address}
              </h2>
              <p className="text-sm font-mono text-muted-foreground" data-testid="text-plot-parcel">
                Parcel #{plot.parcelNumber}
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button size="icon" variant="ghost" data-testid="button-bookmark-plot">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="button-share-plot">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ZoningBadge zoning={plot.zoning} />
            <Badge variant="outline" className="text-xs">{plot.currentUse}</Badge>
          </div>
        </div>

        <Separator />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard 
            label="Lot Size" 
            value={`${plot.size.toLocaleString()} sqm`} 
            icon={Maximize2} 
          />
          <MetricCard 
            label="Zoning" 
            value={plot.zoning} 
            icon={Building2} 
          />
          <MetricCard 
            label="Market Value" 
            value={plot.marketValue ? `SAR ${(plot.marketValue / 1000000).toFixed(2)}M` : "N/A"} 
            icon={DollarSign} 
          />
          <MetricCard 
            label="Owner" 
            value={plot.ownerName || "N/A"} 
            icon={User} 
          />
        </div>

        <Separator />

        {/* Details Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="location">
            <AccordionTrigger className="text-sm font-medium">Location Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latitude</span>
                  <span className="font-mono">{plot.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longitude</span>
                  <span className="font-mono">{plot.longitude.toFixed(6)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="zoning">
            <AccordionTrigger className="text-sm font-medium">Zoning Information</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone Type</span>
                  <span>{plot.zoning}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Use</span>
                  <span>{plot.currentUse}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* HBU Study CTA */}
        <div className="space-y-4">
          <Button 
            className="w-full" 
            size="lg"
            onClick={onGenerateStudy}
            disabled={isGenerating}
            data-testid="button-generate-hbu"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading Analysis...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate HBU Study
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            View comprehensive Highest and Best Use analysis for this plot
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}
