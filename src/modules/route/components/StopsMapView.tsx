import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Stop } from "../interfaces";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom stop marker icon
const createStopIcon = (isActive: boolean) => {
  return L.divIcon({
    className: "stop-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${isActive ? '#10b981' : '#6b7280'};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
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

interface StopsMapViewProps {
  stops: Stop[];
  onStopClick?: (stop: Stop) => void;
  selectedStopId?: string;
  height?: string;
}

export function StopsMapView({
  stops,
  onStopClick,
  selectedStopId,
  height = "500px"
}: StopsMapViewProps) {
  console.log("StopsMapView rendering with", stops.length, "stops");

  // Calculate center of map (default to first stop or Dar es Salaam)
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

  // Filter valid stops with proper coordinates
  const validStops = useMemo(() => {
    const filtered = stops.filter(stop => {
      const lat = typeof stop.latitude === 'string' ? parseFloat(stop.latitude) : stop.latitude;
      const lng = typeof stop.longitude === 'string' ? parseFloat(stop.longitude) : stop.longitude;
      const isValid = !isNaN(lat) && !isNaN(lng);
      if (!isValid) {
        console.log("Invalid stop coordinates:", stop.name, { lat, lng });
      }
      return isValid;
    });
    console.log("Valid stops for map:", filtered.length, "out of", stops.length);
    return filtered;
  }, [stops]);

  console.log("Rendering map with validStops:", validStops.length);

  if (stops.length === 0) {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">Loading stops...</p>
          <p className="text-xs text-gray-500 mt-1">Please wait while we fetch the stops data</p>
        </div>
      </div>
    );
  }

  if (validStops.length === 0) {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">No stops to display on map</p>
          <p className="text-xs text-gray-500 mt-1">Create stops with valid coordinates to see them on the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
      {/* Debug info overlay */}
      <div className="absolute top-2 right-2 z-[1000] bg-white px-3 py-2 rounded shadow-md text-xs">
        <p className="font-semibold">Map Debug Info:</p>
        <p>Total stops: {stops.length}</p>
        <p>Valid stops: {validStops.length}</p>
        <p>Center: [{center[0].toFixed(4)}, {center[1].toFixed(4)}]</p>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height, width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stops={validStops} />

        {validStops.map((stop) => {
          const lat = typeof stop.latitude === 'string' ? parseFloat(stop.latitude) : stop.latitude;
          const lng = typeof stop.longitude === 'string' ? parseFloat(stop.longitude) : stop.longitude;

          return (
            <Marker
              key={stop.id}
              position={[lat, lng]}
              icon={createStopIcon(stop.isActive)}
              eventHandlers={{
                click: () => {
                  if (onStopClick) {
                    onStopClick(stop);
                  }
                },
              }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900 mb-1">{stop.name}</p>
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
                      <span className="font-medium">Status:</span>{" "}
                      <span className={stop.isActive ? "text-green-600" : "text-gray-600"}>
                        {stop.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
