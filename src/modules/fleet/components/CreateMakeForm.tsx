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
import { Textarea } from "@/components/ui/textarea";
import { CreateMakeDto } from "../interfaces/make.interface";
import { makeApi } from "../make.api";
import { toast } from "sonner";

interface CreateMakeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMakeCreated: () => void;
}

export function CreateMakeForm({ isOpen, onClose, onMakeCreated }: CreateMakeFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMakeDto>({
    name: "",
    country: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Please fill in the make name");
      return;
    }

    try {
      setLoading(true);
      await makeApi.create(formData);
      toast.success("Make created successfully");
      onMakeCreated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Failed to create make:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create make";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      description: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add New Make</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Add a new vehicle manufacturer to the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-gray-600">
                Make Name *
              </Label>
              <Input
                id="name"
                placeholder="Toyota"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-xs border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-xs text-gray-600">
                Country
              </Label>
              <Input
                id="country"
                placeholder="Japan"
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="text-xs border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs text-gray-600">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Vehicle manufacturer description..."
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
            <Button type="submit" disabled={loading} size="sm" className="text-xs">
              {loading ? "Creating..." : "Create Make"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

