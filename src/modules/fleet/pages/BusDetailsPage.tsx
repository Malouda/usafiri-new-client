import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { busApi } from "../bus.api";
import { Bus } from "../interfaces/bus.interface";
import { SeatLayout } from "../interfaces/seat-layout.interface";
import { SeatDesigner } from "../components/SeatDesigner";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Layout, Trash2 } from "lucide-react";

export default function BusDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bus, setBus] = useState<Bus | null>(null);
  const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      void loadBus();
      void loadSeatLayout();
    }
  }, [id]);

  async function loadBus() {
    if (!id) return;
    try {
      setLoading(true);
      const data = await busApi.getById(id);
      setBus(data);
    } catch (error: any) {
      console.error("Failed to load bus:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load bus";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function loadSeatLayout() {
    if (!id) return;
    try {
      const layout = await busApi.getSeatLayout(id);
      setSeatLayout(layout);
    } catch (error: any) {
      // Don't show error for 404 (layout doesn't exist yet - it's optional)
      if (error?.response?.status === 404) {
        setSeatLayout(null);
        return;
      }
      console.error("Failed to load seat layout:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load seat layout";
      toast.error(errorMessage);
    }
  }

  async function handleSaveLayout(layout: SeatLayout) {
    if (!id) return;
    try {
      await busApi.setSeatLayout(id, layout);
      setSeatLayout(layout);
      toast.success("Seat layout saved successfully");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save seat layout:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save seat layout";
      toast.error(errorMessage);
      throw error; // Re-throw so SeatDesigner can handle it
    }
  }

  async function handleDeleteLayout() {
    if (!id) return;
    try {
      await busApi.deleteSeatLayout(id);
      setSeatLayout(null);
      toast.success("Seat layout deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete seat layout:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete seat layout";
      toast.error(errorMessage);
    }
  }

  async function handleBusCapacityChange(newCapacity: number) {
    if (!id || !bus) return;
    try {
      const updatedBus = await busApi.update(id, { numberOfSeats: newCapacity });
      setBus(updatedBus);
      toast.success("Bus capacity updated successfully");
    } catch (error: any) {
      console.error("Failed to update bus capacity:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update bus capacity";
      toast.error(errorMessage);
      throw error; // Re-throw so SeatDesigner can handle it
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-xs text-red-600 mb-4">Bus not found</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/fleet/buses")} className="text-xs">
            Back to Buses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/fleet/buses")}
            className="text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Bus Details</h1>
            <p className="text-xs text-gray-600">Plate Number: {bus.plateNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs"
          >
            <Layout className="h-4 w-4 mr-2" />
            {seatLayout ? "Edit Seat Layout" : "Create Seat Layout"}
          </Button>
          {seatLayout && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteLayout}
              className="text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Layout
            </Button>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Plate Number</p>
            <p className="text-xs text-gray-900 font-medium">{bus.plateNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Make</p>
            <p className="text-xs text-gray-900 font-medium">{bus.makeEntity?.name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Model</p>
            <p className="text-xs text-gray-900 font-medium">{bus.modelEntity?.name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Capacity</p>
            <p className="text-xs text-gray-900 font-medium">{bus.numberOfSeats} seats</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="text-xs text-gray-900 font-medium">{bus.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Seat Layout</p>
            <p className="text-xs text-gray-900 font-medium">
              {seatLayout ? "Configured" : "Not configured"}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Seat Layout Designer</DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Design the seat layout for {bus.plateNumber}. Bus capacity: {bus.numberOfSeats} seats. You can edit the capacity directly in the designer.
            </DialogDescription>
          </DialogHeader>
          <SeatDesigner
            initialLayout={seatLayout}
            busCapacity={bus.numberOfSeats}
            onSave={handleSaveLayout}
            onCancel={() => setIsModalOpen(false)}
            onBusCapacityChange={handleBusCapacityChange}
            showSaveButton={true}
            readOnly={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

