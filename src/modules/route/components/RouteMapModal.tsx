import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import L from "leaflet";
import { Route, RouteStop, UpdateRouteDto } from "../interfaces/route.interface";
import { Stop } from "../interfaces";
import { DraggableStopList } from "./DraggableStopList";
import { routeApi } from "../route.api";
import { toast } from "sonner";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom stop marker icon with sequence number
const createStopIcon = (sequence: number, isFirst: boolean, isLast: boolean) => {
  const color = isFirst ? '#10b981' : isLast ? '#ef4444' : '#3b82f6';

  return L.divIcon({
    className: "stop-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
      ">
        ${sequence}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to fit map bounds to all stops
function FitBounds({ stops }: { stops: Stop[] }) {
  const map = useMap();

  useEffect(() => {
    if (stops.length === 0) return;

    const validStops = stops.filter(stop => {
      const lat = typeof stop.latitude === 'string' ? parseFloat(stop.latitude) : stop.latitude;
      const lng = typeof stop.longitude === 'string' ? parseFloat(stop.longitude) : stop.longitude;
      return !isNaN(lat) && !isNaN(lng);
    });

    if (validStops.length === 0) return;

    const bounds = L.latLngBounds(
      validStops.map(stop => {
        const lat = typeof stop.latitude === 'string' ? parseFloat(stop.latitude) : stop.latitude;
        const lng = typeof stop.longitude === 'string' ? parseFloat(stop.longitude) : stop.longitude;
        return [lat, lng] as [number, number];
      })
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  }, [stops, map]);

  return null;
}

interface RouteMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Route;
  onRouteUpdated?: (updatedRoute: Route) => void;
}

export function RouteMapModal({ open, onOpenChange, route, onRouteUpdated }: RouteMapModalProps) {
  console.log("RouteMapModal - route:", route);
  console.log("RouteMapModal - routeStops:", route.routeStops);

  const [reorderedRouteStops, setReorderedRouteStops] = useState<RouteStop[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize reorderedRouteStops when route changes
  useEffect(() => {
    if (route.routeStops && route.routeStops.length > 0) {
      const sorted = [...route.routeStops].sort((a, b) => a.sequence - b.sequence);
      setReorderedRouteStops(sorted);
    }
  }, [route.routeStops]);

  // Extract stops from route with their sequence
  const stops = useMemo(() => {
    if (!reorderedRouteStops || reorderedRouteStops.length === 0) {
      return [];
    }

    // Sort by sequence and extract stop data
    return reorderedRouteStops
      .filter(rs => rs.stop) // Only include if stop data exists
      .sort((a, b) => a.sequence - b.sequence)
      .map(rs => rs.stop!);
  }, [reorderedRouteStops]);

  console.log("RouteMapModal - processed stops:", stops.length);

  // Handle reordering of stops
  const handleReorder = (reordered: RouteStop[]) => {
    setReorderedRouteStops(reordered);
  };

  // Save reordered stops to backend
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Prepare update DTO with reordered stops
      const updateDto: UpdateRouteDto = {
        stops: reorderedRouteStops.map((rs) => ({
          stopId: rs.stopId,
          sequence: rs.sequence,
          estimatedDurationMinutes: rs.estimatedDurationMinutes,
        })),
      };

      // Call API to update route
      const updatedRoute = await routeApi.update(route.id, updateDto);

      // Show success message
      toast.success("Stop order updated successfully!");

      // Notify parent component of the update
      if (onRouteUpdated) {
        onRouteUpdated(updatedRoute);
      }

      // Update local state with the response
      if (updatedRoute.routeStops) {
        const sorted = [...updatedRoute.routeStops].sort((a, b) => a.sequence - b.sequence);
        setReorderedRouteStops(sorted);
      }
    } catch (error: any) {
      console.error("Error updating stop order:", error);
      toast.error(error.message || "Failed to update stop order");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate map center (use first stop or default)
  const center = useMemo((): [number, number] => {
    if (stops.length > 0 && stops[0].latitude && stops[0].longitude) {
      const lat = typeof stops[0].latitude === 'string' ? parseFloat(stops[0].latitude) : stops[0].latitude;
      const lng = typeof stops[0].longitude === 'string' ? parseFloat(stops[0].longitude) : stops[0].longitude;
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    // Default to Dar es Salaam center
    return [-6.7924, 39.2083];
  }, [stops]);

  // Create polyline coordinates for route path
  const routePath = useMemo((): [number, number][] => {
    return stops
      .filter(stop => {
        const lat = typeof stop.latitude === 'string' ? parseFloat(stop.latitude) : stop.latitude;
        const lng = typeof stop.longitude === 'string' ? parseFloat(stop.longitude) : stop.longitude;
        return !isNaN(lat) && !isNaN(lng);
      })
      .map(stop => {
        const lat = typeof stop.latitude === 'string' ? parseFloat(stop.latitude) : stop.latitude;
        const lng = typeof stop.longitude === 'string' ? parseFloat(stop.longitude) : stop.longitude;
        return [lat, lng] as [number, number];
      });
  }, [stops]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-lg text-gray-900">
            {route.name}
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            {stops.length} stops • Green = Start, Red = End, Blue = Intermediate
          </p>
        </DialogHeader>

        <Tabs defaultValue="map" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-6 mb-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="manage">Manage Stops</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="flex-1 relative min-h-0 px-6 pb-6 mt-0">
            {stops.length > 0 ? (
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBounds stops={stops} />

                {/* Route path polyline */}
                {routePath.length > 1 && (
                  <Polyline
                    positions={routePath}
                    color="#3b82f6"
                    weight={4}
                    opacity={0.7}
                    dashArray="10, 10"
                  />
                )}

                {/* Stop markers */}
                {stops.map((stop, index) => {
                  const lat = typeof stop.latitude === 'string' ? parseFloat(stop.latitude) : stop.latitude;
                  const lng = typeof stop.longitude === 'string' ? parseFloat(stop.longitude) : stop.longitude;

                  if (isNaN(lat) || isNaN(lng)) return null;

                  const sequence = reorderedRouteStops[index]?.sequence || index + 1;
                  const isFirst = index === 0;
                  const isLast = index === stops.length - 1;

                  return (
                    <Marker
                      key={stop.id || index}
                      position={[lat, lng]}
                      icon={createStopIcon(sequence, isFirst, isLast)}
                    >
                      <Popup>
                        <div className="text-xs">
                          <p className="font-semibold text-gray-900 mb-1">
                            {isFirst && "🚀 Start: "}
                            {isLast && "🏁 End: "}
                            {!isFirst && !isLast && `Stop ${sequence}: `}
                            {stop.name}
                          </p>
                          {stop.description && (
                            <p className="text-gray-600 mb-2">{stop.description}</p>
                          )}
                          <div className="space-y-1 text-gray-500">
                            <p>
                              <span className="font-medium">Latitude:</span> {lat.toFixed(6)}
                            </p>
                            <p>
                              <span className="font-medium">Longitude:</span> {lng.toFixed(6)}
                            </p>
                            <p>
                              <span className="font-medium">Sequence:</span> {sequence}
                            </p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="h-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">No stops found for this route</p>
                  <p className="text-xs text-gray-500 mt-1">Add stops to this route to see them on the map</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage" className="flex-1 overflow-auto px-6 pb-6 mt-0">
            {reorderedRouteStops.length > 0 ? (
              <DraggableStopList
                routeStops={reorderedRouteStops}
                onReorder={handleReorder}
                onSave={handleSave}
                isSaving={isSaving}
              />
            ) : (
              <div className="h-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">No stops found for this route</p>
                  <p className="text-xs text-gray-500 mt-1">Add stops to this route to manage their order</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
