import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateRouteDto, RouteStopDto } from "../interfaces/route.interface";
import { Stop } from "../interfaces";
import { routeApi } from "../route.api";
import { stopApi } from "../stop.api";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface CreateRouteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteCreated: () => void;
}

export function CreateRouteForm({ isOpen, onClose, onRouteCreated }: CreateRouteFormProps) {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const [selectedStops, setSelectedStops] = useState<RouteStopDto[]>([]);
  const [formData, setFormData] = useState<CreateRouteDto>({
    description: "",
    stops: [],
  });

  useEffect(() => {
    if (isOpen) {
      void fetchStops();
      resetForm();
    }
  }, [isOpen]);

  function resetForm() {
    setFormData({
      description: "",
      stops: [],
    });
    setSelectedStops([]);
  }

  async function fetchStops() {
    try {
      setLoadingStops(true);
      console.log("Fetching stops from API...");
      const data = await stopApi.getAll(true); // Include inactive stops
      console.log("Stops fetched successfully:", data);
      setStops(data);
      if (data.length === 0) {
        console.warn("No stops found in database. User needs to create stops first.");
        // Don't show error toast for empty array - it's a valid state
      }
    } catch (error: any) {
      console.error("Failed to fetch stops:", error);
      console.error("Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load stops";
      toast.error("Failed to load stops", {
        description: errorMessage,
        duration: 5000,
      });
      setStops([]); // Ensure stops array is empty on error
    } finally {
      setLoadingStops(false);
    }
  }

  function handleAddStop() {
    // Add a new stop selection (will be assigned sequence automatically)
    setSelectedStops([...selectedStops, { stopId: "", sequence: selectedStops.length + 1 }]);
  }

  function handleRemoveStop(index: number) {
    const updated = selectedStops.filter((_, i) => i !== index);
    // Reassign sequences
    const reindexed = updated.map((stop, i) => ({ ...stop, sequence: i + 1 }));
    setSelectedStops(reindexed);
  }

  function handleStopChange(index: number, stopId: string) {
    const updated = [...selectedStops];
    updated[index] = { ...updated[index], stopId };
    setSelectedStops(updated);
  }

  function handleDurationChange(index: number, duration: number | undefined) {
    const updated = [...selectedStops];
    updated[index] = { ...updated[index], estimatedDurationMinutes: duration };
    setSelectedStops(updated);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const updated = [...selectedStops];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    // Reassign sequences
    const reindexed = updated.map((stop, i) => ({ ...stop, sequence: i + 1 }));
    setSelectedStops(reindexed);
  }

  function handleMoveDown(index: number) {
    if (index === selectedStops.length - 1) return;
    const updated = [...selectedStops];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    // Reassign sequences
    const reindexed = updated.map((stop, i) => ({ ...stop, sequence: i + 1 }));
    setSelectedStops(reindexed);
  }

  async function handleSubmit() {
    // Validate
    if (selectedStops.length < 2) {
      toast.error("Route must have at least 2 stops");
      return;
    }

    // Check for duplicate stops
    const stopIds = selectedStops.map((s) => s.stopId);
    const uniqueStopIds = new Set(stopIds);
    if (uniqueStopIds.size !== stopIds.length) {
      toast.error("Duplicate stops are not allowed");
      return;
    }

    // Check all stops are selected
    if (stopIds.some((id) => !id)) {
      toast.error("Please select a stop for all positions");
      return;
    }

    try {
      setLoading(true);
      const payload: CreateRouteDto = {
        description: formData.description || undefined,
        stops: selectedStops.map((stop) => ({
          stopId: stop.stopId,
          sequence: stop.sequence,
          estimatedDurationMinutes: 
            stop.estimatedDurationMinutes && stop.estimatedDurationMinutes > 0 
              ? stop.estimatedDurationMinutes 
              : undefined,
        })),
      };
      await routeApi.create(payload);
      toast.success("Route created successfully");
      onRouteCreated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Failed to create route:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create route";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  // Get available stops (stops that are not already selected, or the currently selected stop for the current index)
  const getAvailableStops = (currentIndex: number): Stop[] => {
    const currentStopId = selectedStops[currentIndex]?.stopId;
    return stops.filter(
      (stop) =>
        !selectedStops.some((s, idx) => s.stopId === stop.id && idx !== currentIndex) ||
        stop.id === currentStopId
    );
  };

  // Check if form is valid for submission
  const isFormValid = (): boolean => {
    // Must have at least 2 stops
    if (selectedStops.length < 2) {
      return false;
    }
    
    // All stops must have a stopId selected
    if (selectedStops.some((stop) => !stop.stopId || stop.stopId.trim() === "")) {
      return false;
    }
    
    // Check for duplicate stops
    const stopIds = selectedStops.map((s) => s.stopId).filter(Boolean);
    const uniqueStopIds = new Set(stopIds);
    if (uniqueStopIds.size !== stopIds.length) {
      return false;
    }
    
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create New Route</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Create a route by selecting stops in sequence. Route name will be auto-generated from first and last stop.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs text-gray-600">
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="Enter route description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-xs border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600">
                Route Stops (Minimum 2 required)
                {stops.length > 0 && (
                  <span className="ml-2 text-xs text-gray-500">({stops.length} available)</span>
                )}
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddStop}
                disabled={loadingStops || stops.length === 0 || selectedStops.length >= stops.length}
                className="h-7 text-xs"
                title={
                  stops.length === 0
                    ? "No stops available. Please create stops first."
                    : selectedStops.length >= stops.length
                    ? "All available stops have been added."
                    : "Add a stop to the route"
                }
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Stop
              </Button>
            </div>

            {loadingStops ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">Loading stops...</p>
              </div>
            ) : stops.length === 0 ? (
              <div className="space-y-2 border border-gray-200 rounded-md p-4 bg-gray-50">
                <p className="text-xs text-red-600 font-medium">No stops available</p>
                <p className="text-xs text-gray-600">
                  You need to create stops before creating a route. Stops represent pickup/dropoff locations.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Please create stops first using the Stops management page, then return here to create your route.
                </p>
              </div>
            ) : selectedStops.length === 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">Click "Add Stop" to start building your route.</p>
                <p className="text-xs text-gray-500">Available stops: {stops.length}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedStops.length < 2 && (
                  <div className="border border-yellow-200 rounded-md p-3 bg-yellow-50 mb-2">
                    <p className="text-xs text-yellow-800 font-medium">
                      {selectedStops.length === 1 && stops.length === 1
                        ? "⚠️ You need at least 2 stops to create a route, but only 1 stop is available in the system."
                        : `⚠️ You need at least 2 stops to create a route. Currently you have ${selectedStops.length} stop(s).`}
                    </p>
                    {selectedStops.length === 1 && stops.length === 1 && (
                      <p className="text-xs text-yellow-700 mt-1">
                        Please create more stops using the Stops management page, then return here to create your route.
                      </p>
                    )}
                    {selectedStops.length === 1 && stops.length > 1 && (
                      <p className="text-xs text-yellow-700 mt-1">
                        Click "Add Stop" to add another stop to your route.
                      </p>
                    )}
                  </div>
                )}
                <div className="border border-gray-200 rounded-md p-4">
                  {selectedStops.map((selectedStop, index) => {
                    const availableStopsForIndex = getAvailableStops(index);
                    return (
                      <div key={index} className="flex gap-2 items-end mb-2 last:mb-0">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="h-7 w-7 p-0"
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === selectedStops.length - 1}
                            className="h-7 w-7 p-0"
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-gray-600">
                            Stop {index + 1}
                          </Label>
                          <Select
                            value={selectedStop.stopId}
                            onValueChange={(value) => handleStopChange(index, value)}
                          >
                            <SelectTrigger className="text-xs border-gray-200">
                              <SelectValue placeholder="Select stop" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStopsForIndex.length === 0 ? (
                                <SelectItem value="" disabled className="text-xs">
                                  No stops available
                                </SelectItem>
                              ) : (
                                availableStopsForIndex.map((stop) => (
                                  <SelectItem key={stop.id} value={stop.id} className="text-xs">
                                    {stop.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-gray-600">
                            Duration (min, optional)
                          </Label>
                          <Input
                            type="number"
                            min={1}
                            placeholder="15"
                            value={selectedStop.estimatedDurationMinutes || ""}
                            onChange={(e) => {
                              const value = e.target.value.trim();
                              handleDurationChange(
                                index,
                                value && !isNaN(parseInt(value)) && parseInt(value) > 0
                                  ? parseInt(value)
                                  : undefined
                              );
                            }}
                            className="text-xs border-gray-200"
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStop(index)}
                          className="h-9 w-9 p-0"
                          title="Remove stop"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading} size="sm" className="text-xs">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !isFormValid()} 
            size="sm" 
            className="text-xs"
          >
            {loading ? "Creating..." : "Create Route"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

