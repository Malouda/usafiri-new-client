import { useEffect, useState } from "react";
import { makeApi } from "../make.api";
import { Make } from "../interfaces/make.interface";
import { MakeStats } from "../components/MakeStats";
import { MakeList } from "../components/MakeList";
import { CreateMakeForm } from "../components/CreateMakeForm";
import { UpdateMakeForm } from "../components/UpdateMakeForm";
import { toast } from "sonner";

export default function MakesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [makes, setMakes] = useState<Make[]>([]);
  const [totalMakes, setTotalMakes] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);

  // Compute skip and take for pagination
  const take = pageSize;
  const skip = currentPage * pageSize;

  useEffect(() => {
    void fetchMakes();
  }, [currentPage, pageSize]);

  async function fetchMakes() {
    try {
      setLoading(true);
      setError(null);
      const response = await makeApi.getAllPaginated(currentPage + 1, pageSize);
      setMakes(response.data);
      setTotalMakes(response.total);
    } catch (err) {
      console.error("Failed to fetch makes:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch makes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(selected: { selected: number }) {
    setCurrentPage(selected.selected);
  }

  function handleCreateMake() {
    setIsCreateDialogOpen(true);
  }

  function handleUpdateMake(make: Make) {
    setSelectedMake(make);
    setIsUpdateDialogOpen(true);
  }

  async function handleDeleteMake(makeId: string) {
    if (!confirm("Are you sure you want to delete this make? This will fail if it has associated models.")) {
      return;
    }

    try {
      await makeApi.deleteMake(makeId);
      toast.success("Make deleted successfully");
      await fetchMakes();
    } catch (error: any) {
      console.error("Failed to delete make:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete make";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="p-6">
      <MakeStats makes={makes} loading={loading} />

      <MakeList
        makes={makes}
        totalMakes={totalMakes}
        loading={loading}
        error={error}
        skip={skip}
        take={take}
        onPageChange={handlePageChange}
        onCreateMake={handleCreateMake}
        onUpdateMake={handleUpdateMake}
        onDeleteMake={handleDeleteMake}
        onRetry={fetchMakes}
      />

      <CreateMakeForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onMakeCreated={fetchMakes}
      />

      {selectedMake && (
        <UpdateMakeForm
          isOpen={isUpdateDialogOpen}
          onClose={() => {
            setIsUpdateDialogOpen(false);
            setSelectedMake(null);
          }}
          make={selectedMake}
          onMakeUpdated={fetchMakes}
        />
      )}
    </div>
  );
}

