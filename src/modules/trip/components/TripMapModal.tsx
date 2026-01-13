import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trip } from "../interfaces/trip.interface";
import { Stop } from "../../route/interfaces/stop.interface";
import { stopApi } from "../../route/stop.api";
import { useTripTracking } from "../../../hooks/useTripTracking";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom bus icon
const createBusIcon = (heading?: number) => {
  return L.divIcon({
    className: "bus-marker",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: rotate(${heading || 0}deg);
      ">
        <span style="color: white; font-size: 16px;">🚌</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Custom stop icon
const createStopIcon = () => {
  return L.divIcon({
    className: "stop-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #ef4444;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to update map view when bus location changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom(), {
      animate: true,
      duration: 1,
    });
  }, [center, map]);

  return null;
}

interface TripMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip;
}

export function TripMapModal({ open, onOpenChange, trip }: TripMapModalProps) {
  const { getTripLocation, subscribeToTrip, unsubscribeFromTrip } = useTripTracking();
  const [busLocation, setBusLocation] = useState<{ lat: number; lng: number; heading?: number } | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Fetch stops for the trip when modal opens
  useEffect(() => {
    if (open && trip.id) {
      setLoadingStops(true);
      stopApi.getStopsForTrip(trip.id)
        .then((fetchedStops) => {
          console.log("Fetched stops for trip:", fetchedStops.length, "stops");
          setStops(fetchedStops);
        })
        .catch((err) => {
          console.error("Failed to fetch stops for trip:", err);
          setStops([]);
        })
        .finally(() => {
          setLoadingStops(false);
        });
    }
  }, [open, trip.id]);

  // Subscribe to trip GPS updates when modal opens
  useEffect(() => {
    if (open && trip) {
      const sessionId = trip.sessions?.[0]?.id;
      subscribeToTrip(trip.id, sessionId);

      // Get initial location if available
      const location = getTripLocation(trip.id);
      if (location) {
        setBusLocation({
          lat: typeof location.latitude === 'number' ? location.latitude : parseFloat(String(location.latitude)),
          lng: typeof location.longitude === 'number' ? location.longitude : parseFloat(String(location.longitude)),
          heading: location.heading,
        });
      }

      return () => {
        unsubscribeFromTrip(trip.id, sessionId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trip?.id]);

  // Update bus location when online trips state changes
  useEffect(() => {
    if (!open) return;

    const location = getTripLocation(trip.id);
    if (location) {
      const lat = typeof location.latitude === 'number' ? location.latitude : parseFloat(String(location.latitude));
      const lng = typeof location.longitude === 'number' ? location.longitude : parseFloat(String(location.longitude));

      if (!isNaN(lat) && !isNaN(lng)) {
        setBusLocation({
          lat,
          lng,
          heading: location.heading,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTripLocation(trip.id), open]);

  // Calculate map center (use bus location if available, otherwise use first stop or default)
  const getMapCenter = (): [number, number] => {
    if (busLocation && typeof busLocation.lat === 'number' && typeof busLocation.lng === 'number') {
      return [busLocation.lat, busLocation.lng];
    }
    if (stops.length > 0 && stops[0].latitude && stops[0].longitude) {
      const lat = typeof stops[0].latitude === 'number' ? stops[0].latitude : parseFloat(String(stops[0].latitude));
      const lng = typeof stops[0].longitude === 'number' ? stops[0].longitude : parseFloat(String(stops[0].longitude));
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    // Default to Dar es Salaam center
    return [-6.7924, 39.2083];
  };

  const mapCenter = getMapCenter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-xs text-gray-900">
            {trip.route?.name || "Trip Route"} - Live Tracking
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative min-h-0 px-6 pb-6">
          {mapCenter && (
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%", borderRadius: "8px" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Bus location marker */}
              {busLocation && typeof busLocation.lat === 'number' && typeof busLocation.lng === 'number' && (
                <>
                  <Marker
                    position={[busLocation.lat, busLocation.lng]}
                    icon={createBusIcon(busLocation.heading)}
                  >
                    <Popup>
                      <div className="text-xs">
                        <p className="font-medium">Bus Location</p>
                        <p>Lat: {busLocation.lat.toFixed(6)}</p>
                        <p>Lng: {busLocation.lng.toFixed(6)}</p>
                        {busLocation.heading && <p>Heading: {busLocation.heading}°</p>}
                      </div>
                    </Popup>
                  </Marker>
                  <MapUpdater center={[busLocation.lat, busLocation.lng]} />
                </>
              )}

              {/* Route stops markers */}
              {stops.map((stop, index) => {
                if (!stop.latitude || !stop.longitude) return null;
                const stopLat = typeof stop.latitude === 'number' ? stop.latitude : parseFloat(String(stop.latitude));
                const stopLng = typeof stop.longitude === 'number' ? stop.longitude : parseFloat(String(stop.longitude));
                
                if (isNaN(stopLat) || isNaN(stopLng)) return null;
                
                return (
                  <Marker
                    key={stop.id || index}
                    position={[stopLat, stopLng]}
                    icon={createStopIcon()}
                  >
                    <Popup>
                      <div className="text-xs">
                        <p className="font-medium">{stop.name || `Stop ${index + 1}`}</p>
                        <p>Sequence: {stop.sequence || index + 1}</p>
                        <p>Lat: {stopLat.toFixed(6)}</p>
                        <p>Lng: {stopLng.toFixed(6)}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
          
          {!busLocation && (
            <div className="absolute top-4 left-4 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-800">
              <p>Waiting for GPS update from driver...</p>
            </div>
          )}

          {loadingStops && (
            <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-md p-2 text-xs text-blue-800">
              <p>Loading stops...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

