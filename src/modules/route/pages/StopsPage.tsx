import { useEffect, useState, useRef } from "react";
import { stopApi } from "../stop.api";
import { tripApi } from "../../trip/trip.api";
import { Stop } from "../interfaces";
import { Trip } from "../../trip/interfaces/trip.interface";
import { StopStats } from "../components/StopStats";
import { StopList } from "../components/StopList";
import { StopsMapView } from "../components/StopsMapView";
import { CreateStopForm } from "../components/CreateStopForm";
import { UpdateStopForm } from "../components/UpdateStopForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { List, Map as MapIcon } from "lucide-react";

export default function StopsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [allStops, setAllStops] = useState<Stop[]>([]); // For map view (all stops)
  const [totalStops, setTotalStops] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Trip filter for map view
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [generatingAudio, setGeneratingAudio] = useState<string | null>(null);

  // Audio playback states
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const presignedUrlCache = useRef<Map<string, { url: string; expiresAt: number }>>(new Map());

  // Compute skip and take for pagination
  const take = pageSize;
  const skip = currentPage * pageSize;

  useEffect(() => {
    void fetchStops();
  }, [currentPage, pageSize]);

  // Fetch trips when component mounts
  useEffect(() => {
    void fetchTrips();
  }, []);

  // Fetch stops for selected trip when it changes
  useEffect(() => {
    if (viewMode === 'map') {
      if (selectedTripId && selectedTripId !== 'all') {
        void fetchStopsForTrip(selectedTripId);
      } else {
        void fetchAllStops();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedTripId]);

  async function fetchTrips() {
    try {
      const response = await tripApi.getAll({ status: 'ACTIVE' });
      setTrips(response);
      // Auto-select first trip if available
      if (response.length > 0) {
        setSelectedTripId(response[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    }
  }

  async function fetchStops() {
    try {
      setLoading(true);
      setError(null);
      const response = await stopApi.getAllPaginated(currentPage + 1, pageSize);
      setStops(response.data);
      setTotalStops(response.total);
    } catch (err) {
      console.error("Failed to fetch stops:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stops";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllStops() {
    try {
      console.log("Fetching all stops for map view...");
      const response = await stopApi.getAll(true); // Include inactive stops
      console.log("Fetched stops for map:", response.length, "stops");
      setAllStops(response);
    } catch (err) {
      console.error("Failed to fetch all stops for map:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stops for map";
      toast.error(errorMessage);
    }
  }

  async function fetchStopsForTrip(tripId: string) {
    try {
      console.log("Fetching stops for trip:", tripId);
      const response = await stopApi.getStopsForTrip(tripId);
      console.log("Fetched stops for trip:", response.length, "stops");
      setAllStops(response);
    } catch (err) {
      console.error("Failed to fetch stops for trip:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stops for trip";
      toast.error(errorMessage);
      setAllStops([]); // Clear stops on error
    }
  }

  async function handlePageChange(selected: { selected: number }) {
    setCurrentPage(selected.selected);
  }

  function handleCreateStop() {
    setIsCreateDialogOpen(true);
  }

  function handleUpdateStop(stop: Stop) {
    setSelectedStop(stop);
    setIsUpdateDialogOpen(true);
  }

  async function handleDeleteStop(stopId: string) {
    if (!confirm("Are you sure you want to delete this stop?")) {
      return;
    }

    try {
      await stopApi.deleteStop(stopId);
      toast.success("Stop deleted successfully");
      await fetchStops();
    } catch (error: any) {
      console.error("Failed to delete stop:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete stop";
      toast.error(errorMessage);
    }
  }

  async function handleGenerateAudio(stopId: string) {
    try {
      setGeneratingAudio(stopId);
      await stopApi.generateAudio(stopId);
      toast.success("Audio generation queued successfully. The stop will be updated when generation completes.");
      // Refresh stops after a short delay to check for updated audioUrl
      setTimeout(() => {
        void fetchStops();
      }, 2000);
    } catch (error: any) {
      console.error("Failed to generate audio:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to generate audio";
      toast.error(errorMessage);
    } finally {
      setGeneratingAudio(null);
    }
  }

  async function handleDeleteAudio(stopId: string) {
    if (!confirm("Are you sure you want to delete this audio file? You'll need to regenerate it.")) {
      return;
    }

    try {
      await stopApi.deleteAudio(stopId);
      toast.success("Audio deleted successfully. The audio URL has been removed from the database.");
      // Immediately update local state to reflect the deletion
      setStops((prevStops) =>
        prevStops.map((stop) =>
          stop.id === stopId ? { ...stop, audioUrl: undefined } : stop
        )
      );
      // Also refresh from server to ensure consistency
      await fetchStops();
    } catch (error: any) {
      console.error("Failed to delete audio:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete audio";
      toast.error(errorMessage);
    }
  }

  async function handlePlayAudio(stopId: string) {
    try {
      // If already playing this audio, pause it
      if (playingAudio === stopId && audioRef.current) {
        audioRef.current.pause();
        setPlayingAudio(null);
        return;
      }

      // If playing different audio, stop it first
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setLoadingAudio(stopId);

      // Always fetch new presigned URL (don't use cache for now to test)
      const now = Date.now();
      let presignedUrl: string;

      console.log("Fetching new presigned URL for stop:", stopId);
      const response = await stopApi.getAudioUrl(stopId);
      presignedUrl = response.presignedUrl;
      console.log("Received presigned URL, expires in:", response.expiresIn, "seconds");
      console.log("Full presigned URL:", presignedUrl);

      // Cache the URL (expires in 50 minutes to be safe, server sets 1 hour)
      presignedUrlCache.current.set(stopId, {
        url: presignedUrl,
        expiresAt: now + 50 * 60 * 1000,
      });

      // Test fetch first to see if we can access the URL
      console.log("Testing URL accessibility with fetch...");
      try {
        const testResponse = await fetch(presignedUrl, { method: 'HEAD' });
        console.log("Fetch test response:", {
          status: testResponse.status,
          statusText: testResponse.statusText,
          contentType: testResponse.headers.get('content-type'),
          contentLength: testResponse.headers.get('content-length'),
        });
      } catch (fetchError: any) {
        console.error("Fetch test failed:", fetchError);
      }

      // Create and play audio
      console.log("Creating Audio element with URL:", presignedUrl);
      const audio = new Audio(presignedUrl);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        console.log("Audio playback ended");
        setPlayingAudio(null);
      });

      audio.addEventListener("error", (e: Event) => {
        console.error("Audio error event:", e);
        const audioElement = e.target as HTMLAudioElement;
        console.error("Audio element error details:", {
          error: audioElement.error,
          networkState: audioElement.networkState,
          readyState: audioElement.readyState,
          src: audioElement.src
        });

        let errorMsg = "Failed to load audio file. ";
        if (audioElement.error) {
          switch (audioElement.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMsg += "The audio download was aborted.";
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMsg += "A network error occurred while downloading the audio.";
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMsg += "The audio file is corrupted or in an unsupported format.";
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg += "The audio file format is not supported or the file does not exist.";
              break;
            default:
              errorMsg += "An unknown error occurred.";
          }
        } else {
          errorMsg += "The audio may not exist or there may be a network error.";
        }

        toast.error(errorMsg);
        setPlayingAudio(null);
      });

      audio.addEventListener("loadeddata", () => {
        console.log("Audio data loaded successfully");
      });

      audio.addEventListener("loadstart", () => {
        console.log("Audio started loading");
      });

      audio.addEventListener("canplay", () => {
        console.log("Audio can start playing");
      });

      console.log("Attempting to play audio...");
      await audio.play();
      console.log("Audio playing");
      setPlayingAudio(stopId);
    } catch (error: any) {
      console.error("Failed to play audio:", error);
      let errorMessage = "Failed to play audio";

      if (error?.response?.status === 404) {
        errorMessage = "Audio file not found. Please generate audio for this stop first.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoadingAudio(null);
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-6">
      <StopStats stops={stops} loading={loading} />

      {/* View Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="text-xs h-8"
          >
            <List className="h-3 w-3 mr-1" />
            List View
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="text-xs h-8"
          >
            <MapIcon className="h-3 w-3 mr-1" />
            Map View
          </Button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <StopList
          stops={stops}
          totalStops={totalStops}
          loading={loading}
          error={error}
          skip={skip}
          take={take}
          onPageChange={handlePageChange}
          onCreateStop={handleCreateStop}
          onUpdateStop={handleUpdateStop}
          onDeleteStop={handleDeleteStop}
          onGenerateAudio={handleGenerateAudio}
          onDeleteAudio={handleDeleteAudio}
          onPlayAudio={handlePlayAudio}
          generatingAudio={generatingAudio}
          playingAudio={playingAudio}
          loadingAudio={loadingAudio}
          onRetry={fetchStops}
        />
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Stops Map {allStops.length > 0 && `(${allStops.length} stops)`}
              </h2>

              {/* Trip Selector */}
              {trips.length > 0 && (
                <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                  <SelectTrigger className="w-[280px] h-8 text-xs">
                    <SelectValue placeholder="Select a trip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      All Stops
                    </SelectItem>
                    {trips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id} className="text-xs">
                        {trip.route?.name || trip.name || `Trip ${trip.id.slice(0, 8)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Button size="sm" onClick={handleCreateStop} className="text-xs h-8">
              <span className="text-xs mr-1">+</span>
              Create Stop
            </Button>
          </div>
          <StopsMapView
            stops={allStops}
            onStopClick={handleUpdateStop}
            height="600px"
          />
        </div>
      )}

      <CreateStopForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onStopCreated={fetchStops}
      />

      <UpdateStopForm
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedStop(null);
        }}
        stop={selectedStop}
        onStopUpdated={fetchStops}
      />
    </div>
  );
}

