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
import { CreateDriverDto } from "../interfaces/driver.interface";
import { driverApi } from "../driver.api";
import { toast } from "sonner";

interface CreateDriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onDriverCreated: () => void;
}

export function CreateDriverForm({ isOpen, onClose, onDriverCreated }: CreateDriverFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDriverDto>({
    phone: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      await driverApi.create(formData);
      toast.success("Driver created successfully");
      onDriverCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create driver:", error);
      toast.error("Failed to create driver");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      phone: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add New Driver</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Create a new driver account
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
              <Label htmlFor="password" className="text-xs text-gray-600">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="text-xs border-gray-200"
                required
                minLength={8}
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
              {loading ? "Creating..." : "Create Driver"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

