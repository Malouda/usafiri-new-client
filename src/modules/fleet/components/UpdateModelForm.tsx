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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Model, UpdateModelDto } from "../interfaces/model.interface";
import { Make } from "../interfaces/make.interface";
import { modelApi } from "../model.api";
import { makeApi } from "../make.api";
import { toast } from "sonner";

interface UpdateModelFormProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model | null;
  onModelUpdated: () => void;
}

export function UpdateModelForm({ isOpen, onClose, model, onModelUpdated }: UpdateModelFormProps) {
  const [loading, setLoading] = useState(false);
  const [makes, setMakes] = useState<Make[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [formData, setFormData] = useState<UpdateModelDto>({
    makeId: "",
    name: "",
    typicalSeats: undefined,
    description: "",
  });

  useEffect(() => {
    if (isOpen) {
      void fetchMakes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (model) {
      setFormData({
        makeId: model.makeId,
        name: model.name,
        typicalSeats: model.typicalSeats,
        description: model.description || "",
      });
    }
  }, [model]);

  async function fetchMakes() {
    try {
      setLoadingMakes(true);
      const data = await makeApi.getAll();
      setMakes(data);
    } catch (error) {
      console.error("Failed to fetch makes:", error);
      toast.error("Failed to load makes");
    } finally {
      setLoadingMakes(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!model || !formData.name || !formData.makeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await modelApi.update(model.id, formData);
      toast.success("Model updated successfully");
      onModelUpdated();
      onClose();
    } catch (error: any) {
      console.error("Failed to update model:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update model";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Update Model</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Update model information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="makeId" className="text-xs text-gray-600">
                Make *
              </Label>
              <Select
                value={formData.makeId || ""}
                onValueChange={(value) => setFormData({ ...formData, makeId: value })}
                disabled={loadingMakes}
              >
                <SelectTrigger className="text-xs border-gray-200">
                  <SelectValue placeholder="Select a make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((make) => (
                    <SelectItem key={make.id} value={make.id} className="text-xs">
                      {make.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-gray-600">
                Model Name *
              </Label>
              <Input
                id="name"
                placeholder="Coaster"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-xs border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typicalSeats" className="text-xs text-gray-600">
                Typical Seats
              </Label>
              <Input
                id="typicalSeats"
                type="number"
                min="1"
                placeholder="30"
                value={formData.typicalSeats || ""}
                onChange={(e) => setFormData({ ...formData, typicalSeats: parseInt(e.target.value) || undefined })}
                className="text-xs border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs text-gray-600">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Vehicle model description..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-xs border-gray-200 min-h-[80px]"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              size="sm"
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || loadingMakes} size="sm" className="text-xs">
              {loading ? "Updating..." : "Update Model"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

