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
import { UpdateStopDto, Stop } from "../interfaces";
import { stopApi } from "../stop.api";
import { toast } from "sonner";

interface UpdateStopFormProps {
  isOpen: boolean;
  onClose: () => void;
  stop: Stop | null;
  onStopUpdated: () => void;
}

export function UpdateStopForm({ isOpen, onClose, stop, onStopUpdated }: UpdateStopFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateStopDto>({
    name: "",
    latitude: 0,
    longitude: 0,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (isOpen && stop) {
      // Convert latitude/longitude to numbers if they're strings (decimal types from DB)
      const latitude = typeof stop.latitude === 'string' 
        ? parseFloat(stop.latitude) 
        : stop.latitude;
      const longitude = typeof stop.longitude === 'string' 
        ? parseFloat(stop.longitude) 
        : stop.longitude;
      
      setFormData({
        name: stop.name,
        latitude: !isNaN(latitude) ? latitude : 0,
        longitude: !isNaN(longitude) ? longitude : 0,
        description: stop.description || "",
        isActive: stop.isActive,
      });
    }
  }, [isOpen, stop]);

  function resetForm() {
    if (stop) {
      // Convert latitude/longitude to numbers if they're strings (decimal types from DB)
      const latitude = typeof stop.latitude === 'string' 
        ? parseFloat(stop.latitude) 
        : stop.latitude;
      const longitude = typeof stop.longitude === 'string' 
        ? parseFloat(stop.longitude) 
        : stop.longitude;
      
      setFormData({
        name: stop.name,
        latitude: !isNaN(latitude) ? latitude : 0,
        longitude: !isNaN(longitude) ? longitude : 0,
        description: stop.description || "",
        isActive: stop.isActive,
      });
    } else {
      setFormData({
        name: "",
        latitude: 0,
        longitude: 0,
        description: "",
        isActive: true,
      });
    }
  }

  async function handleSubmit() {
    if (!stop) return;

    // Validate
    if (formData.name && formData.name.trim().length < 2) {
      toast.error("Stop name must be at least 2 characters");
      return;
    }

    if (formData.latitude !== undefined && (formData.latitude < -90 || formData.latitude > 90)) {
      toast.error("Latitude must be between -90 and 90");
      return;
    }

    if (formData.longitude !== undefined && (formData.longitude < -180 || formData.longitude > 180)) {
      toast.error("Longitude must be between -180 and 180");
      return;
    }

    try {
      setLoading(true);
      const payload: UpdateStopDto = {
        name: formData.name?.trim(),
        latitude: formData.latitude !== undefined ? Number(formData.latitude) : undefined,
        longitude: formData.longitude !== undefined ? Number(formData.longitude) : undefined,
        description: formData.description?.trim() || undefined,
        isActive: formData.isActive,
      };
      await stopApi.update(stop.id, payload);
      toast.success("Stop updated successfully");
      onStopUpdated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Failed to update stop:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update stop";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  if (!stop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Update Stop</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Update stop details including name, coordinates, description, or status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-gray-600">
              Stop Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Posta, Ubungo Plaza, Mbezi Beach"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-xs border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-xs text-gray-600">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="-6.792354"
                value={formData.latitude || ""}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
                }
                className="text-xs border-gray-200"
              />
              <p className="text-xs text-gray-500">Range: -90 to 90</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-xs text-gray-600">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="39.208328"
                value={formData.longitude || ""}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
                }
                className="text-xs border-gray-200"
              />
              <p className="text-xs text-gray-500">Range: -180 to 180</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs text-gray-600">
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="e.g., Near Central Post Office"
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading} size="sm" className="text-xs">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} size="sm" className="text-xs">
            {loading ? "Updating..." : "Update Stop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

