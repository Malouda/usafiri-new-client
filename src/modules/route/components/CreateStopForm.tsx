import { useState } from "react";
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
import { CreateStopDto } from "../interfaces";
import { stopApi } from "../stop.api";
import { toast } from "sonner";

interface CreateStopFormProps {
  isOpen: boolean;
  onClose: () => void;
  onStopCreated: () => void;
}

export function CreateStopForm({ isOpen, onClose, onStopCreated }: CreateStopFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateStopDto>({
    name: "",
    latitude: 0,
    longitude: 0,
    description: "",
  });

  function resetForm() {
    setFormData({
      name: "",
      latitude: 0,
      longitude: 0,
      description: "",
    });
  }

  async function handleSubmit() {
    // Validate
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Stop name must be at least 2 characters");
      return;
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      toast.error("Latitude must be between -90 and 90");
      return;
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      toast.error("Longitude must be between -180 and 180");
      return;
    }

    try {
      setLoading(true);
      const payload: CreateStopDto = {
        name: formData.name.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        description: formData.description?.trim() || undefined,
      };
      await stopApi.create(payload);
      toast.success("Stop created successfully");
      onStopCreated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Failed to create stop:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create stop";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create New Stop</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Create a pickup/dropoff location with GPS coordinates. Coordinates must be valid: latitude ∈ [-90, 90], longitude ∈ [-180, 180]
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-gray-600">
              Stop Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Posta, Ubungo Plaza, Mbezi Beach"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-xs border-gray-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-xs text-gray-600">
                Latitude <span className="text-red-600">*</span>
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
                required
              />
              <p className="text-xs text-gray-500">Range: -90 to 90</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-xs text-gray-600">
                Longitude <span className="text-red-600">*</span>
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
                required
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading} size="sm" className="text-xs">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} size="sm" className="text-xs">
            {loading ? "Creating..." : "Create Stop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

