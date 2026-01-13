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
import { UpdateRouteDto, RouteStopDto, Route } from "../interfaces/route.interface";
import { Stop } from "../interfaces";
import { routeApi } from "../route.api";
import { stopApi } from "../stop.api";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface UpdateRouteFormProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  onRouteUpdated: () => void;
}

export function UpdateRouteForm({ isOpen, onClose, route, onRouteUpdated }: UpdateRouteFormProps) {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const [selectedStops, setSelectedStops] = useState<RouteStopDto[]>([]);
  const [formData, setFormData] = useState<UpdateRouteDto>({
    description: "",
    isActive: true,
    stops: [],
  });

  useEffect(() => {
    if (isOpen && route) {
      // Validate route has an ID
      if (!route.id) {
        console.error("[UpdateRouteForm] Route ID is missing:", route);
        toast.error("Route ID is missing. Cannot load route data.");
        onClose();
        return;
      }
      void fetchStops();
      loadRouteData();
    }
  }, [isOpen, route]);

  function loadRouteData() {
    if (!route) {
      console.warn("[UpdateRouteForm] loadRouteData called but route is null");
      return;
    }

    if (!route.id) {
      console.error("[UpdateRouteForm] Route ID is missing in loadRouteData:", route);
      toast.error("Route ID is missing. Cannot load route data.");
      return;
    }

    setFormData({
      description: route.description || "",
      isActive: route.isActive,
      stops: [],
    });

    // Load route stops with sequence
    if (route.routeStops && route.routeStops.length > 0) {
      const sortedStops = [...route.routeStops].sort((a, b) => a.sequence - b.sequence);
      setSelectedStops(
        sortedStops.map((rs) => ({
          stopId: rs.stopId,
          sequence: rs.sequence,
          // Convert null to undefined for duration (null from DB, undefined for empty input)
          estimatedDurationMinutes: 
            rs.estimatedDurationMinutes !== null && rs.estimatedDurationMinutes !== undefined
              ? rs.estimatedDurationMinutes
              : undefined,
        }))
      );
    } else {
      setSelectedStops([]);
    }
  }

  function resetForm() {
    setFormData({
      description: "",
      isActive: true,
      stops: [],
    });
    setSelectedStops([]);
  }

  async function fetchStops() {
    try {
      setLoadingStops(true);
      // Fetch all stops (including inactive) so we can display already-selected inactive stops
      // But filter will ensure only active stops appear in dropdown for new selections
      const data = await stopApi.getAll(true);
      setStops(data);
    } catch (error) {
      console.error("Failed to fetch stops:", error);
      toast.error("Failed to load stops");
    } finally {
      setLoadingStops(false);
    }
  }

  function handleAddStop() {
    setSelectedStops([...selectedStops, { stopId: "", sequence: selectedStops.length + 1 }]);
  }

  function handleRemoveStop(index: number) {
    const updated = selectedStops.filter((_, i) => i !== index);
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
    const reindexed = updated.map((stop, i) => ({ ...stop, sequence: i + 1 }));
    setSelectedStops(reindexed);
  }

  function handleMoveDown(index: number) {
    if (index === selectedStops.length - 1) return;
    const updated = [...selectedStops];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    const reindexed = updated.map((stop, i) => ({ ...stop, sequence: i + 1 }));
    setSelectedStops(reindexed);
  }

  async function handleSubmit() {
    if (!route) {
      toast.error("Route not found");
      return;
    }

    // Validate route has an ID
    if (!route.id) {
      console.error("Route ID is missing:", route);
      toast.error("Route ID is missing. Cannot update route.");
      return;
    }

    // Validate
    if (selectedStops.length < 2) {
      toast.error("Route must have at least 2 stops");
      return;
    }

    const stopIds = selectedStops.map((s) => s.stopId);
    const uniqueStopIds = new Set(stopIds);
    if (uniqueStopIds.size !== stopIds.length) {
      toast.error("Duplicate stops are not allowed");
      return;
    }

    if (stopIds.some((id) => !id)) {
      toast.error("Please select a stop for all positions");
      return;
    }

    try {
      setLoading(true);
      const payload: UpdateRouteDto = {
        description: formData.description || undefined,
        isActive: formData.isActive,
        stops: selectedStops.map((stop) => ({
          stopId: stop.stopId,
          sequence: stop.sequence,
          estimatedDurationMinutes: 
            stop.estimatedDurationMinutes && stop.estimatedDurationMinutes > 0 
              ? stop.estimatedDurationMinutes 
              : undefined,
        })),
      };
      
      await routeApi.update(route.id, payload);
      toast.success("Route updated successfully");
      onRouteUpdated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Failed to update route:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update route";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  const getAvailableStops = (currentIndex: number): Stop[] => {
    const currentStopId = selectedStops[currentIndex]?.stopId;
    return stops.filter(
      (stop) =>
        // Only show active stops (or the currently selected stop if it's inactive)
        (stop.isActive || stop.id === currentStopId) &&
        // Don't show stops that are already selected in other positions
        (!selectedStops.some((s, idx) => s.stopId === stop.id && idx !== currentIndex) ||
          stop.id === currentStopId)
    );
  };

  if (!route) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Update Route</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Update route details, stops, or status. Route name will be recalculated if stops change.
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
            <Label htmlFor="isActive" className="text-xs text-gray-600">
              Status
            </Label>
            <Select
              value={formData.isActive ? "active" : "inactive"}
              onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
            >
              <SelectTrigger className="text-xs border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active" className="text-xs">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-xs">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600">Route Stops (Minimum 2 required)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddStop}
                disabled={loadingStops || stops.length === 0 || selectedStops.length >= stops.length}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Stop
              </Button>
            </div>

            {loadingStops ? (
              <p className="text-xs text-gray-600">Loading stops...</p>
            ) : stops.length === 0 ? (
              <p className="text-xs text-gray-600">No stops available.</p>
            ) : selectedStops.length === 0 ? (
              <p className="text-xs text-gray-600">Click "Add Stop" to add stops to the route.</p>
            ) : (
              <div className="space-y-2 border border-gray-200 rounded-md p-4">
                {selectedStops.map((selectedStop, index) => {
                  const availableStopsForIndex = getAvailableStops(index);
                  return (
                    <div key={index} className="flex gap-2 items-end">
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
                        <Label className="text-xs text-gray-600">Stop {index + 1}</Label>
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
                        <Label className="text-xs text-gray-600">Duration (min, optional)</Label>
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
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading} size="sm" className="text-xs">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || selectedStops.length < 2} size="sm" className="text-xs">
            {loading ? "Updating..." : "Update Route"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

