import { useEffect, useState } from "react";
import { driverApi } from "../driver.api";
import { Driver } from "../interfaces/driver.interface";
import { DriverStats } from "../components/DriverStats";
import { DriverList } from "../components/DriverList";
import { CreateDriverForm } from "../components/CreateDriverForm";
import { UpdateDriverForm } from "../components/UpdateDriverForm";
import { toast } from "sonner";

export default function DriversPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Compute skip and take for pagination
  const take = pageSize;
  const skip = currentPage * pageSize;

  useEffect(() => {
    void fetchDrivers();
  }, [currentPage, pageSize]);

  async function fetchDrivers() {
    try {
      setLoading(true);
      setError(null);
      const response = await driverApi.getAllPaginated(currentPage + 1, pageSize);
      setDrivers(response.data);
      setTotalDrivers(response.total);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch drivers";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(selected: { selected: number }) {
    setCurrentPage(selected.selected);
  }

  function handleCreateDriver() {
    setIsCreateDialogOpen(true);
  }

  function handleUpdateDriver(driver: Driver) {
    setSelectedDriver(driver);
    setIsUpdateDialogOpen(true);
  }

  async function handleDeleteDriver(driverId: string) {
    if (!confirm("Are you sure you want to deactivate this driver?")) {
      return;
    }

    try {
      await driverApi.deleteDriver(driverId);
      toast.success("Driver deactivated successfully");
      await fetchDrivers();
    } catch (error) {
      console.error("Failed to deactivate driver:", error);
      toast.error("Failed to deactivate driver");
    }
  }

  return (
    <div className="p-6">
      <DriverStats drivers={drivers} loading={loading} />

      <DriverList
        drivers={drivers}
        totalDrivers={totalDrivers}
        loading={loading}
        error={error}
        skip={skip}
        take={take}
        onPageChange={handlePageChange}
        onCreateDriver={handleCreateDriver}
        onUpdateDriver={handleUpdateDriver}
        onDeleteDriver={handleDeleteDriver}
        onRetry={fetchDrivers}
      />

      <CreateDriverForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onDriverCreated={fetchDrivers}
      />

      <UpdateDriverForm
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedDriver(null);
        }}
        driver={selectedDriver}
        onDriverUpdated={fetchDrivers}
      />
    </div>
  );
}

