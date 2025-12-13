import { Layers, Building2, Users, Train } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MapLayersPanelProps {
  layers: {
    plots: boolean;
    zoning: boolean;
    demographics: boolean;
    transit: boolean;
  };
  onToggleLayer: (layer: keyof MapLayersPanelProps['layers']) => void;
}

export function MapLayersPanel({ layers, onToggleLayer }: MapLayersPanelProps) {
  return (
    <Card className="absolute top-4 left-4 z-[1000] w-56 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Map Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="layer-plots" className="text-sm flex items-center gap-2 cursor-pointer">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            Plot Boundaries
          </Label>
          <Switch
            id="layer-plots"
            checked={layers.plots}
            onCheckedChange={() => onToggleLayer('plots')}
            data-testid="switch-layer-plots"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="layer-zoning" className="text-sm flex items-center gap-2 cursor-pointer">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            Zoning Overlay
          </Label>
          <Switch
            id="layer-zoning"
            checked={layers.zoning}
            onCheckedChange={() => onToggleLayer('zoning')}
            data-testid="switch-layer-zoning"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="layer-demographics" className="text-sm flex items-center gap-2 cursor-pointer">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            Demographics
          </Label>
          <Switch
            id="layer-demographics"
            checked={layers.demographics}
            onCheckedChange={() => onToggleLayer('demographics')}
            data-testid="switch-layer-demographics"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="layer-transit" className="text-sm flex items-center gap-2 cursor-pointer">
            <Train className="h-3.5 w-3.5 text-muted-foreground" />
            Transit Lines
          </Label>
          <Switch
            id="layer-transit"
            checked={layers.transit}
            onCheckedChange={() => onToggleLayer('transit')}
            data-testid="switch-layer-transit"
          />
        </div>
      </CardContent>
    </Card>
  );
}
