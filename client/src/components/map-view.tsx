import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, useMap, useMapEvents } from "react-leaflet";
import type { Plot } from "@shared/schema";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  plots: Plot[];
  selectedPlot: Plot | null;
  onPlotSelect: (plot: Plot) => void;
  onMapClick?: () => void;
  center?: [number, number];
  zoom?: number;
}

function PlotPolygon({ 
  plot, 
  isSelected, 
  onClick 
}: { 
  plot: Plot; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const boundaries = plot.boundaries as number[][] | null;
  
  if (!boundaries || boundaries.length === 0) {
    return null;
  }

  const positions = boundaries.map(coord => [coord[1], coord[0]] as [number, number]);

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: isSelected ? "hsl(210, 78%, 48%)" : "hsl(210, 6%, 35%)",
        fillColor: isSelected ? "hsl(210, 78%, 48%)" : "hsl(210, 12%, 50%)",
        fillOpacity: isSelected ? 0.35 : 0.15,
        weight: isSelected ? 3 : 2,
      }}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: (e) => {
      if (!(e.originalEvent.target as HTMLElement).closest(".leaflet-interactive")) {
        onMapClick();
      }
    },
  });
  return null;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      map.setView(center, zoom);
      initialized.current = true;
    }
  }, [map, center, zoom]);

  return null;
}

export function MapView({ 
  plots, 
  selectedPlot, 
  onPlotSelect,
  onMapClick,
  center = [40.7128, -74.006], // Default to NYC
  zoom = 14
}: MapViewProps) {
  return (
    <div className="h-full w-full relative" data-testid="map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        <MapClickHandler onMapClick={onMapClick || (() => {})} />
        
        {plots.map((plot) => (
          <PlotPolygon
            key={plot.id}
            plot={plot}
            isSelected={selectedPlot?.id === plot.id}
            onClick={() => onPlotSelect(plot)}
          />
        ))}
      </MapContainer>
      
      {/* Coordinates display */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-md border border-card-border z-[1000]">
        <span className="text-xs font-mono text-muted-foreground">
          {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </span>
      </div>
    </div>
  );
}
