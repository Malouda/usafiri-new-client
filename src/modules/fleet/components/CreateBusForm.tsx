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
import { CreateBusDto } from "../interfaces/bus.interface";
import { Make } from "../interfaces/make.interface";
import { Model } from "../interfaces/model.interface";
import { busApi } from "../bus.api";
import { makeApi } from "../make.api";
import { modelApi } from "../model.api";
import { toast } from "sonner";

interface CreateBusFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBusCreated: () => void;
}

export function CreateBusForm({ isOpen, onClose, onBusCreated }: CreateBusFormProps) {
  const [loading, setLoading] = useState(false);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [formData, setFormData] = useState<CreateBusDto>({
    plateNumber: "",
    makeId: "",
    modelId: "",
    numberOfSeats: 0,
  });

  useEffect(() => {
    if (isOpen) {
      void fetchMakes();
    }
  }, [isOpen]);

  const handleMakeChange = (makeId: string) => {
    setFormData({ ...formData, makeId, modelId: "" });
    if (makeId) {
      void fetchModels(makeId);
    } else {
      setModels([]);
    }
  };

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

  async function fetchModels(makeId: string) {
    try {
      setLoadingModels(true);
      const data = await modelApi.getAll({ makeId });
      setModels(data);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast.error("Failed to load models");
    } finally {
      setLoadingModels(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.plateNumber || !formData.makeId || !formData.modelId || formData.numberOfSeats < 1) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await busApi.create(formData);
      toast.success("Bus created successfully");
      resetForm();
      onBusCreated();
      onClose();
    } catch (error: any) {
      console.error("Failed to create bus:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create bus";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      plateNumber: "",
      makeId: "",
      modelId: "",
      numberOfSeats: 0,
    });
    setModels([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Register New Bus</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Add a new bus to your fleet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plateNumber" className="text-xs text-gray-600">
                Plate Number *
              </Label>
              <Input
                id="plateNumber"
                placeholder="ABC-1234"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="text-xs border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="makeId" className="text-xs text-gray-600">
                Make *
              </Label>
              <Select
                value={formData.makeId}
                onValueChange={handleMakeChange}
                disabled={loadingMakes}
              >
                <SelectTrigger className="text-xs border-gray-200">
                  <SelectValue placeholder={loadingMakes ? "Loading makes..." : "Select a make"} />
                </SelectTrigger>
                <SelectContent>
                  {makes.length > 0 ? (
                    makes.map((make) => (
                      <SelectItem key={make.id} value={make.id} className="text-xs">
                        {make.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-makes" disabled className="text-xs text-gray-500">
                      {loadingMakes ? "Loading..." : "No makes available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {!loadingMakes && makes.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No makes found. Please create a make first in the Makes page.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelId" className="text-xs text-gray-600">
                Model *
              </Label>
              <Select
                value={formData.modelId}
                onValueChange={(value) => setFormData({ ...formData, modelId: value })}
                disabled={loadingModels || !formData.makeId || models.length === 0}
              >
                <SelectTrigger className="text-xs border-gray-200">
                  <SelectValue 
                    placeholder={
                      loadingModels 
                        ? "Loading models..." 
                        : !formData.makeId 
                        ? "Select a make first" 
                        : models.length === 0
                        ? "No models available"
                        : "Select a model"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {models.length > 0 ? (
                    models.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="text-xs">
                        {model.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-models" disabled className="text-xs text-gray-500">
                      No models available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formData.makeId && models.length === 0 && !loadingModels && (
                <p className="text-xs text-gray-500 mt-1">
                  No models found for this make. Please create a model first in the Models page.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfSeats" className="text-xs text-gray-600">
                Number of Seats *
              </Label>
              <Input
                id="numberOfSeats"
                type="number"
                min="1"
                placeholder="30"
                value={formData.numberOfSeats || ""}
                onChange={(e) => setFormData({ ...formData, numberOfSeats: parseInt(e.target.value) || 0 })}
                className="text-xs border-gray-200"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              size="sm"
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || loadingMakes || loadingModels} size="sm" className="text-xs">
              {loading ? "Creating..." : "Create Bus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

