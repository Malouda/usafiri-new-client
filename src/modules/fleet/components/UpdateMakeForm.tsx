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
import { Make, UpdateMakeDto } from "../interfaces/make.interface";
import { makeApi } from "../make.api";
import { toast } from "sonner";

interface UpdateMakeFormProps {
  isOpen: boolean;
  onClose: () => void;
  make: Make | null;
  onMakeUpdated: () => void;
}

export function UpdateMakeForm({ isOpen, onClose, make, onMakeUpdated }: UpdateMakeFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateMakeDto>({
    name: "",
    country: "",
    description: "",
  });

  useEffect(() => {
    if (make) {
      setFormData({
        name: make.name,
        country: make.country || "",
        description: make.description || "",
      });
    }
  }, [make]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make || !formData.name) {
      toast.error("Please fill in the make name");
      return;
    }

    try {
      setLoading(true);
      await makeApi.update(make.id, formData);
      toast.success("Make updated successfully");
      onMakeUpdated();
      onClose();
    } catch (error: any) {
      console.error("Failed to update make:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update make";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Update Make</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Update make information
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
                value={formData.name || ""}
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
              {loading ? "Updating..." : "Update Make"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

