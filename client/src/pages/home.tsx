import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { MapView } from "@/components/map-view";
import { PlotInfoPanel } from "@/components/plot-info-panel";
import { HbuReportModal } from "@/components/hbu-report-modal";
import { MapLayersPanel } from "@/components/map-layers-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Plot, HbuStudy } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [initialSelectionDone, setInitialSelectionDone] = useState(false);
  const [viewingStudy, setViewingStudy] = useState<HbuStudy | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [layers, setLayers] = useState({
    plots: true,
    zoning: false,
    demographics: false,
    transit: false,
  });

  // Fetch all plots
  const { data: plots = [], isLoading: plotsLoading, error: plotsError } = useQuery<Plot[]>({
    queryKey: ['/api/plots'],
  });

  // Auto-select first plot on initial load
  useEffect(() => {
    if (plots.length > 0 && !initialSelectionDone && !selectedPlot) {
      setSelectedPlot(plots[0]);
      setInitialSelectionDone(true);
    }
  }, [plots, initialSelectionDone, selectedPlot]);

  // Generate HBU study mutation
  const generateStudy = useMutation({
    mutationFn: async (plotId: string) => {
      const response = await apiRequest('POST', '/api/hbu-studies', { plotId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "HBU Study Ready",
        description: "Your analysis is ready to view.",
      });
      setViewingStudy(data.study);
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate HBU study. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePlotSelect = useCallback((plot: Plot) => {
    setSelectedPlot(plot);
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  }, [sidebarOpen]);

  const handleDeselectPlot = useCallback(() => {
    setSelectedPlot(null);
  }, []);

  const handleGenerateStudy = () => {
    if (selectedPlot) {
      generateStudy.mutate(selectedPlot.id);
    }
  };

  const handleToggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          {plotsLoading ? (
            <div className="h-full flex items-center justify-center bg-muted/50">
              <div className="text-center space-y-4">
                <Skeleton className="h-8 w-48 mx-auto" />
                <p className="text-sm text-muted-foreground">Loading map data...</p>
              </div>
            </div>
          ) : plotsError ? (
            <div className="h-full flex items-center justify-center bg-muted/50">
              <div className="text-center space-y-4">
                <p className="text-destructive font-medium">Failed to load plots</p>
                <p className="text-sm text-muted-foreground">Please refresh the page to try again.</p>
              </div>
            </div>
          ) : (
            <>
              <MapView
                plots={layers.plots ? plots : []}
                selectedPlot={selectedPlot}
                onPlotSelect={handlePlotSelect}
                onMapClick={handleDeselectPlot}
              />
              <MapLayersPanel 
                layers={layers}
                onToggleLayer={handleToggleLayer}
              />
            </>
          )}

          {/* Sidebar toggle button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[1000] hidden md:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-toggle-sidebar"
          >
            {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Info Panel Sidebar */}
        <aside 
          className={`
            border-l bg-background transition-all duration-300 ease-in-out overflow-hidden
            ${sidebarOpen ? 'w-[400px]' : 'w-0'}
            hidden md:block
          `}
        >
          <PlotInfoPanel
            plot={selectedPlot}
            onGenerateStudy={handleGenerateStudy}
            isGenerating={generateStudy.isPending}
          />
        </aside>

        {/* Mobile bottom sheet (simplified) */}
        <div className={`
          fixed inset-x-0 bottom-0 z-50 md:hidden
          transition-transform duration-300 ease-in-out
          ${selectedPlot ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="bg-background border-t rounded-t-xl max-h-[60vh] overflow-auto">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 mb-2" />
            <PlotInfoPanel
              plot={selectedPlot}
              onGenerateStudy={handleGenerateStudy}
              isGenerating={generateStudy.isPending}
            />
          </div>
        </div>
      </div>

      {/* HBU Report Modal */}
      <HbuReportModal
        study={viewingStudy}
        plot={selectedPlot}
        open={!!viewingStudy}
        onClose={() => setViewingStudy(null)}
      />
    </div>
  );
}
