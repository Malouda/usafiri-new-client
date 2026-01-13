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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { tripApi } from "../trip.api";
import { CreateNonRepeatingTripDto, CreateRepeatingTripDto, TripVisibility, OperatingDay } from "../interfaces/trip.interface";
import { routeApi } from "../../route/route.api";
import { Route } from "../../route/interfaces/route.interface";
import { busApi } from "../../fleet/bus.api";
import { Bus } from "../../fleet/interfaces/bus.interface";
import { toast } from "sonner";

// Local type alias for DTO TimeSlot (simplified version without entity fields)
type TimeSlotDto = {
  departureTime: string;
  arrivalTime?: string;
};

interface CreateTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export function CreateTripModal({ open, onOpenChange, onSuccess }: CreateTripModalProps) {
  const [activeTab, setActiveTab] = useState<"non-repeating" | "repeating">("non-repeating");
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingBuses, setLoadingBuses] = useState(false);

  // Non-repeating trip form state
  const [nonRepeatingForm, setNonRepeatingForm] = useState<CreateNonRepeatingTripDto>({
    routeId: "",
    busId: "",
    startDate: "",
    endDate: "",
    morningDepartureTime: "",
    morningArrivalTime: "",
    eveningDepartureTime: "",
    eveningArrivalTime: "",
    pricePerDayCents: 0,
    visibility: TripVisibility.PRIVATE,
    includeWeekends: false,
  });

  // Repeating trip form state - using OperatingDay structure
  const [repeatingForm, setRepeatingForm] = useState<CreateRepeatingTripDto>({
    routeId: "",
    busId: "",
    startDate: "",
    endDate: "",
    operatingDays: [],
    pricePerDayCents: 0,
    visibility: TripVisibility.PRIVATE,
  });

  const handleCreateNonRepeating = async () => {
    try {
      setLoading(true);
      // Format times to include seconds (HH:MM:SS format)
      const formattedForm: CreateNonRepeatingTripDto = {
        ...nonRepeatingForm,
        morningDepartureTime: formatTimeToHHMMSS(nonRepeatingForm.morningDepartureTime),
        morningArrivalTime: nonRepeatingForm.morningArrivalTime
          ? formatTimeToHHMMSS(nonRepeatingForm.morningArrivalTime)
          : undefined,
        eveningDepartureTime: formatTimeToHHMMSS(nonRepeatingForm.eveningDepartureTime),
        eveningArrivalTime: nonRepeatingForm.eveningArrivalTime
          ? formatTimeToHHMMSS(nonRepeatingForm.eveningArrivalTime)
          : undefined,
      };
      await tripApi.createNonRepeating(formattedForm);
      toast.success("Non-repeating trip created successfully");
      onSuccess();
      onOpenChange(false);
      resetForms();
    } catch (error: any) {
      console.error("Failed to create non-repeating trip:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create trip";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRepeating = async () => {
    // Validate that at least one operating day with time slots is configured
    const validOperatingDays = repeatingForm.operatingDays.filter(
      (day) => day.timeSlots.length > 0 && day.timeSlots.some((slot) => slot.departureTime)
    );

    if (validOperatingDays.length === 0) {
      toast.error("Please configure at least one operating day with time slots");
      return;
    }

    // Validate that all time slots have departure times
    for (const day of validOperatingDays) {
      for (const slot of day.timeSlots) {
        if (!slot.departureTime) {
          toast.error(`Please provide departure time for all time slots on ${day.day}`);
          return;
        }
      }
    }

    try {
      setLoading(true);
      // Format time slots to include seconds (HH:MM:SS format)
      const formattedForm: CreateRepeatingTripDto = {
        ...repeatingForm,
        operatingDays: validOperatingDays.map((day) => ({
          day: day.day,
          timeSlots: day.timeSlots
            .filter((slot) => slot.departureTime)
            .map((slot) => ({
              departureTime: formatTimeToHHMMSS(slot.departureTime),
              arrivalTime: slot.arrivalTime ? formatTimeToHHMMSS(slot.arrivalTime) : undefined,
            })),
        })) as OperatingDay[],
      };
      await tripApi.createRepeating(formattedForm);
      toast.success("Repeating trip created successfully");
      onSuccess();
      onOpenChange(false);
      resetForms();
    } catch (error: any) {
      console.error("Failed to create repeating trip:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create trip";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time from HH:MM to HH:MM:SS
  const formatTimeToHHMMSS = (time: string): string => {
    if (!time) return "";
    // If already in HH:MM:SS format, return as is
    if (time.split(":").length === 3) return time;
    // If in HH:MM format, add :00 seconds
    return `${time}:00`;
  };

  const resetForms = () => {
    setNonRepeatingForm({
      routeId: "",
      busId: "",
      startDate: "",
      endDate: "",
      morningDepartureTime: "",
      morningArrivalTime: "",
      eveningDepartureTime: "",
      eveningArrivalTime: "",
      pricePerDayCents: 0,
      visibility: TripVisibility.PRIVATE,
      includeWeekends: false,
    });
    setRepeatingForm({
      routeId: "",
      busId: "",
      startDate: "",
      endDate: "",
      operatingDays: [],
      pricePerDayCents: 0,
      visibility: TripVisibility.PRIVATE,
    });
  };

  // Get or create operating day for a specific day
  const getOperatingDay = (day: string): OperatingDay => {
    const existing = repeatingForm.operatingDays.find((d) => d.day === day);
    if (existing) return existing;
    const timeSlot: TimeSlotDto = { departureTime: "", arrivalTime: "" };
    return { day, timeSlots: [timeSlot] } as OperatingDay;
  };

  // Toggle operating day (add/remove)
  const toggleDay = (day: string) => {
    const existingIndex = repeatingForm.operatingDays.findIndex((d) => d.day === day);
    if (existingIndex >= 0) {
      // Remove day
      setRepeatingForm({
        ...repeatingForm,
        operatingDays: repeatingForm.operatingDays.filter((d) => d.day !== day),
      });
    } else {
      // Add day with default time slot
      const timeSlot: TimeSlotDto = { departureTime: "", arrivalTime: "" };
      setRepeatingForm({
        ...repeatingForm,
        operatingDays: [...repeatingForm.operatingDays, { day, timeSlots: [timeSlot] } as OperatingDay],
      });
    }
  };

  // Add time slot to a specific day
  const addTimeSlot = (day: string) => {
    const updated = repeatingForm.operatingDays.map((d) => {
      if (d.day === day) {
        const timeSlot: TimeSlotDto = { departureTime: "", arrivalTime: "" };
        return { ...d, timeSlots: [...d.timeSlots, timeSlot] } as OperatingDay;
      }
      return d;
    });
    setRepeatingForm({ ...repeatingForm, operatingDays: updated as OperatingDay[] });
  };

  // Remove time slot from a specific day
  const removeTimeSlot = (day: string, slotIndex: number) => {
    const updated = repeatingForm.operatingDays.map((d) => {
      if (d.day === day) {
        const filteredSlots = d.timeSlots.filter((_, i) => i !== slotIndex);
        // If no time slots remain, remove the day entirely
        if (filteredSlots.length === 0) {
          return null;
        }
        return { ...d, timeSlots: filteredSlots };
      }
      return d;
    }).filter((d): d is OperatingDay => d !== null);
    setRepeatingForm({ ...repeatingForm, operatingDays: updated });
  };

  // Update time slot for a specific day
  const updateTimeSlot = (day: string, slotIndex: number, field: "departureTime" | "arrivalTime", value: string) => {
    const updated = repeatingForm.operatingDays.map((d) => {
      if (d.day === day) {
        const updatedSlots = [...d.timeSlots];
        updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], [field]: value };
        return { ...d, timeSlots: updatedSlots };
      }
      return d;
    });
    setRepeatingForm({ ...repeatingForm, operatingDays: updated });
  };

  // Check if a day is selected
  const isDaySelected = (day: string): boolean => {
    return repeatingForm.operatingDays.some((d) => d.day === day);
  };

  // Fetch routes and buses when modal opens
  useEffect(() => {
    if (open) {
      void fetchRoutes();
      void fetchBuses();
    }
  }, [open]);

  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);
      const data = await routeApi.getAll({ isActive: true });
      setRoutes(data);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      toast.error("Failed to load routes");
      setRoutes([]);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const fetchBuses = async () => {
    try {
      setLoadingBuses(true);
      const data = await busApi.getAll();
      // Filter to only active buses
      const activeBuses = data.filter((bus) => bus.status === "ACTIVE");
      setBuses(activeBuses);
    } catch (error) {
      console.error("Failed to fetch buses:", error);
      toast.error("Failed to load buses");
      setBuses([]);
    } finally {
      setLoadingBuses(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create New Trip</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Create a daily work shuttle or flexible one-way shuttle
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="non-repeating" className="text-xs">
              Daily Shuttle
            </TabsTrigger>
            <TabsTrigger value="repeating" className="text-xs">
              Flexible Shuttle
            </TabsTrigger>
          </TabsList>

          {/* Non-Repeating Trip Form */}
          <TabsContent value="non-repeating" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nr-routeId" className="text-xs text-gray-600">
                  Route
                </Label>
                <Select
                  value={nonRepeatingForm.routeId}
                  onValueChange={(value) => setNonRepeatingForm({ ...nonRepeatingForm, routeId: value })}
                  disabled={loadingRoutes}
                >
                  <SelectTrigger className="text-xs border-gray-200">
                    <SelectValue placeholder={loadingRoutes ? "Loading routes..." : "Select route"} />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id} className="text-xs">
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-busId" className="text-xs text-gray-600">
                  Bus
                </Label>
                <Select
                  value={nonRepeatingForm.busId}
                  onValueChange={(value) => setNonRepeatingForm({ ...nonRepeatingForm, busId: value })}
                  disabled={loadingBuses}
                >
                  <SelectTrigger className="text-xs border-gray-200">
                    <SelectValue placeholder={loadingBuses ? "Loading buses..." : "Select bus"} />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id} className="text-xs">
                        {bus.plateNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-startDate" className="text-xs text-gray-600">
                  Start Date
                </Label>
                <Input
                  id="nr-startDate"
                  type="date"
                  value={nonRepeatingForm.startDate}
                  onChange={(e) => setNonRepeatingForm({ ...nonRepeatingForm, startDate: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-endDate" className="text-xs text-gray-600">
                  End Date
                </Label>
                <Input
                  id="nr-endDate"
                  type="date"
                  value={nonRepeatingForm.endDate}
                  onChange={(e) => setNonRepeatingForm({ ...nonRepeatingForm, endDate: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-morningDeparture" className="text-xs text-gray-600">
                  Morning Departure
                </Label>
                <Input
                  id="nr-morningDeparture"
                  type="time"
                  value={nonRepeatingForm.morningDepartureTime}
                  onChange={(e) => setNonRepeatingForm({ ...nonRepeatingForm, morningDepartureTime: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-morningArrival" className="text-xs text-gray-600">
                  Morning Arrival (Optional)
                </Label>
                <Input
                  id="nr-morningArrival"
                  type="time"
                  value={nonRepeatingForm.morningArrivalTime}
                  onChange={(e) => setNonRepeatingForm({ ...nonRepeatingForm, morningArrivalTime: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-eveningDeparture" className="text-xs text-gray-600">
                  Evening Departure
                </Label>
                <Input
                  id="nr-eveningDeparture"
                  type="time"
                  value={nonRepeatingForm.eveningDepartureTime}
                  onChange={(e) => setNonRepeatingForm({ ...nonRepeatingForm, eveningDepartureTime: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-eveningArrival" className="text-xs text-gray-600">
                  Evening Arrival (Optional)
                </Label>
                <Input
                  id="nr-eveningArrival"
                  type="time"
                  value={nonRepeatingForm.eveningArrivalTime}
                  onChange={(e) => setNonRepeatingForm({ ...nonRepeatingForm, eveningArrivalTime: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-price" className="text-xs text-gray-600">
                  Price per Day (cents)
                </Label>
                <Input
                  id="nr-price"
                  type="number"
                  placeholder="10000"
                  value={nonRepeatingForm.pricePerDayCents}
                  onChange={(e) =>
                    setNonRepeatingForm({ ...nonRepeatingForm, pricePerDayCents: parseInt(e.target.value) || 0 })
                  }
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nr-visibility" className="text-xs text-gray-600">
                  Visibility
                </Label>
                <Select
                  value={nonRepeatingForm.visibility}
                  onValueChange={(value) => setNonRepeatingForm({ ...nonRepeatingForm, visibility: value as TripVisibility })}
                >
                  <SelectTrigger className="text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIVATE" className="text-xs">
                      Private
                    </SelectItem>
                    <SelectItem value="PUBLIC" className="text-xs">
                      Public
                    </SelectItem>
                    <SelectItem value="LINK_ONLY" className="text-xs">
                      Link Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Include Weekends Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="nr-includeWeekends"
                checked={nonRepeatingForm.includeWeekends || false}
                onCheckedChange={(checked) =>
                  setNonRepeatingForm({ ...nonRepeatingForm, includeWeekends: checked === true })
                }
              />
              <Label htmlFor="nr-includeWeekends" className="text-xs text-gray-600 cursor-pointer">
                Include weekends (Saturday and Sunday)
              </Label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} size="sm" className="text-xs">
                Cancel
              </Button>
              <Button onClick={handleCreateNonRepeating} disabled={loading} size="sm" className="text-xs">
                {loading ? "Creating..." : "Create Trip"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Repeating Trip Form */}
          <TabsContent value="repeating" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r-routeId" className="text-xs text-gray-600">
                  Route
                </Label>
                <Select
                  value={repeatingForm.routeId}
                  onValueChange={(value) => setRepeatingForm({ ...repeatingForm, routeId: value })}
                  disabled={loadingRoutes}
                >
                  <SelectTrigger className="text-xs border-gray-200">
                    <SelectValue placeholder={loadingRoutes ? "Loading routes..." : "Select route"} />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id} className="text-xs">
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-busId" className="text-xs text-gray-600">
                  Bus
                </Label>
                <Select
                  value={repeatingForm.busId}
                  onValueChange={(value) => setRepeatingForm({ ...repeatingForm, busId: value })}
                  disabled={loadingBuses}
                >
                  <SelectTrigger className="text-xs border-gray-200">
                    <SelectValue placeholder={loadingBuses ? "Loading buses..." : "Select bus"} />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id} className="text-xs">
                        {bus.plateNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-startDate" className="text-xs text-gray-600">
                  Start Date
                </Label>
                <Input
                  id="r-startDate"
                  type="date"
                  value={repeatingForm.startDate}
                  onChange={(e) => setRepeatingForm({ ...repeatingForm, startDate: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-endDate" className="text-xs text-gray-600">
                  End Date
                </Label>
                <Input
                  id="r-endDate"
                  type="date"
                  value={repeatingForm.endDate}
                  onChange={(e) => setRepeatingForm({ ...repeatingForm, endDate: e.target.value })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-price" className="text-xs text-gray-600">
                  Price per Day (cents)
                </Label>
                <Input
                  id="r-price"
                  type="number"
                  placeholder="10000"
                  value={repeatingForm.pricePerDayCents}
                  onChange={(e) => setRepeatingForm({ ...repeatingForm, pricePerDayCents: parseInt(e.target.value) || 0 })}
                  className="text-xs border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-visibility" className="text-xs text-gray-600">
                  Visibility
                </Label>
                <Select
                  value={repeatingForm.visibility}
                  onValueChange={(value) => setRepeatingForm({ ...repeatingForm, visibility: value as TripVisibility })}
                >
                  <SelectTrigger className="text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIVATE" className="text-xs">
                      Private
                    </SelectItem>
                    <SelectItem value="PUBLIC" className="text-xs">
                      Public
                    </SelectItem>
                    <SelectItem value="LINK_ONLY" className="text-xs">
                      Link Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Operating Days with Time Slots */}
            <div className="space-y-4">
              <Label className="text-xs text-gray-600">Operating Days & Time Slots</Label>
              <p className="text-xs text-gray-600">
                Select days and configure time slots for each day. Each day can have different departure and arrival times.
              </p>

              <div className="space-y-4">
                {DAYS_OF_WEEK.map((dayOption) => {
                  const isSelected = isDaySelected(dayOption.value);
                  const operatingDay = isSelected ? getOperatingDay(dayOption.value) : null;

                  return (
                    <div key={dayOption.value} className="border border-gray-200 rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${dayOption.value}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleDay(dayOption.value)}
                          />
                          <label htmlFor={`day-${dayOption.value}`} className="text-xs font-medium text-gray-900 cursor-pointer">
                            {dayOption.label}
                          </label>
                        </div>
                        {isSelected && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(dayOption.value)}
                            className="h-7 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Time Slot
                          </Button>
                        )}
                      </div>

                      {isSelected && operatingDay && (
                        <div className="space-y-2 pl-6">
                          {operatingDay.timeSlots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex gap-2 items-end">
                              <div className="flex-1 space-y-1">
                                <Label htmlFor={`departure-${dayOption.value}-${slotIndex}`} className="text-xs text-gray-600">
                                  Departure Time
                                </Label>
                                <Input
                                  id={`departure-${dayOption.value}-${slotIndex}`}
                                  type="time"
                                  value={slot.departureTime}
                                  onChange={(e) => updateTimeSlot(dayOption.value, slotIndex, "departureTime", e.target.value)}
                                  className="text-xs border-gray-200"
                                  required
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <Label htmlFor={`arrival-${dayOption.value}-${slotIndex}`} className="text-xs text-gray-600">
                                  Arrival Time (Optional)
                                </Label>
                                <Input
                                  id={`arrival-${dayOption.value}-${slotIndex}`}
                                  type="time"
                                  value={slot.arrivalTime || ""}
                                  onChange={(e) => updateTimeSlot(dayOption.value, slotIndex, "arrivalTime", e.target.value)}
                                  className="text-xs border-gray-200"
                                />
                              </div>
                              {operatingDay.timeSlots.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTimeSlot(dayOption.value, slotIndex)}
                                  className="h-9 w-9 p-0"
                                  title="Remove time slot"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} size="sm" className="text-xs">
                Cancel
              </Button>
              <Button onClick={handleCreateRepeating} disabled={loading} size="sm" className="text-xs">
                {loading ? "Creating..." : "Create Trip"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

