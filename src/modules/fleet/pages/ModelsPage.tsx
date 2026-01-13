import { useEffect, useState } from "react";
import { modelApi } from "../model.api";
import { Model } from "../interfaces/model.interface";
import { ModelStats } from "../components/ModelStats";
import { ModelList } from "../components/ModelList";
import { CreateModelForm } from "../components/CreateModelForm";
import { UpdateModelForm } from "../components/UpdateModelForm";
import { toast } from "sonner";

export default function ModelsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [totalModels, setTotalModels] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Compute skip and take for pagination
  const take = pageSize;
  const skip = currentPage * pageSize;

  useEffect(() => {
    void fetchModels();
  }, [currentPage, pageSize]);

  async function fetchModels() {
    try {
      setLoading(true);
      setError(null);
      const response = await modelApi.getAllPaginated(currentPage + 1, pageSize);
      setModels(response.data);
      setTotalModels(response.total);
    } catch (err) {
      console.error("Failed to fetch models:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch models";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(selected: { selected: number }) {
    setCurrentPage(selected.selected);
  }

  function handleCreateModel() {
    setIsCreateDialogOpen(true);
  }

  function handleUpdateModel(model: Model) {
    setSelectedModel(model);
    setIsUpdateDialogOpen(true);
  }

  async function handleDeleteModel(modelId: string) {
    if (!confirm("Are you sure you want to delete this model? This will fail if it has associated buses.")) {
      return;
    }

    try {
      await modelApi.deleteModel(modelId);
      toast.success("Model deleted successfully");
      await fetchModels();
    } catch (error: any) {
      console.error("Failed to delete model:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete model";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="p-6">
      <ModelStats models={models} loading={loading} />

      <ModelList
        models={models}
        totalModels={totalModels}
        loading={loading}
        error={error}
        skip={skip}
        take={take}
        onPageChange={handlePageChange}
        onCreateModel={handleCreateModel}
        onUpdateModel={handleUpdateModel}
        onDeleteModel={handleDeleteModel}
        onRetry={fetchModels}
      />

      <CreateModelForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onModelCreated={fetchModels}
      />

      {selectedModel && (
        <UpdateModelForm
          isOpen={isUpdateDialogOpen}
          onClose={() => {
            setIsUpdateDialogOpen(false);
            setSelectedModel(null);
          }}
          model={selectedModel}
          onModelUpdated={fetchModels}
        />
      )}
    </div>
  );
}

