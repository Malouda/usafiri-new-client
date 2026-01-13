import { useEffect, useState } from "react";
import { busApi } from "../bus.api";
import { Bus } from "../interfaces/bus.interface";
import { BusStats } from "../components/BusStats";
import { BusList } from "../components/BusList";
import { CreateBusForm } from "../components/CreateBusForm";
import { UpdateBusForm } from "../components/UpdateBusForm";
import { toast } from "sonner";

export default function BusesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [totalBuses, setTotalBuses] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // Compute skip and take for pagination
  const take = pageSize;
  const skip = currentPage * pageSize;

  useEffect(() => {
    void fetchBuses();
  }, [currentPage, pageSize]);

  async function fetchBuses() {
    try {
      setLoading(true);
      setError(null);
      const response = await busApi.getAllPaginated(currentPage + 1, pageSize);
      setBuses(response.data);
      setTotalBuses(response.total);
    } catch (err) {
      console.error("Failed to fetch buses:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch buses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(selected: { selected: number }) {
    setCurrentPage(selected.selected);
  }

  function handleCreateBus() {
    setIsCreateDialogOpen(true);
  }

  function handleUpdateBus(bus: Bus) {
    setSelectedBus(bus);
    setIsUpdateDialogOpen(true);
  }

  async function handleDeleteBus(busId: string) {
    if (!confirm("Are you sure you want to delete this bus?")) {
      return;
    }

    try {
      await busApi.deleteBus(busId);
      toast.success("Bus deleted successfully");
      await fetchBuses();
    } catch (error) {
      console.error("Failed to delete bus:", error);
      toast.error("Failed to delete bus");
    }
  }

  return (
    <div className="p-6">
      <BusStats buses={buses} loading={loading} />

      <BusList
        buses={buses}
        totalBuses={totalBuses}
        loading={loading}
        error={error}
        skip={skip}
        take={take}
        onPageChange={handlePageChange}
        onCreateBus={handleCreateBus}
        onUpdateBus={handleUpdateBus}
        onDeleteBus={handleDeleteBus}
        onRetry={fetchBuses}
      />

      <CreateBusForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onBusCreated={fetchBuses}
      />

      <UpdateBusForm
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedBus(null);
        }}
        bus={selectedBus}
        onBusUpdated={fetchBuses}
      />
    </div>
  );
}

