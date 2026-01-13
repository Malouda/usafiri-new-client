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
import { Driver, UpdateDriverDto, UserStatus } from "../interfaces/driver.interface";
import { driverApi } from "../driver.api";
import { toast } from "sonner";

interface UpdateDriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
  onDriverUpdated: () => void;
}

export function UpdateDriverForm({ isOpen, onClose, driver, onDriverUpdated }: UpdateDriverFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateDriverDto>({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    status: UserStatus.ACTIVE,
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        phone: driver.phone,
        email: driver.email || "",
        firstName: driver.firstName,
        lastName: driver.lastName,
        status: driver.status,
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!driver || !formData.phone || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await driverApi.update(driver.id, formData);
      toast.success("Driver updated successfully");
      onDriverUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update driver:", error);
      toast.error("Failed to update driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Update Driver</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Update driver information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs text-gray-600">
                First Name *
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="text-xs border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs text-gray-600">
                Last Name *
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="text-xs border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs text-gray-600">
                Phone Number *
              </Label>
              <Input
                id="phone"
                placeholder="+255712345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="text-xs border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-gray-600">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="driver@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-xs border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs text-gray-600">
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
              >
                <SelectTrigger className="text-xs border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserStatus.ACTIVE} className="text-xs">
                    Active
                  </SelectItem>
                  <SelectItem value={UserStatus.INACTIVE} className="text-xs">
                    Inactive
                  </SelectItem>
                  <SelectItem value={UserStatus.SUSPENDED} className="text-xs">
                    Suspended
                  </SelectItem>
                </SelectContent>
              </Select>
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
              {loading ? "Updating..." : "Update Driver"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

