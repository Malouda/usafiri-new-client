import { useEffect, useState } from "react";
import { routeApi } from "../route.api";
import { Route } from "../interfaces/route.interface";
import { RouteStats } from "../components/RouteStats";
import { RouteList } from "../components/RouteList";
import { CreateRouteForm } from "../components/CreateRouteForm";
import { UpdateRouteForm } from "../components/UpdateRouteForm";
import { RouteMapModal } from "../components/RouteMapModal";
import { toast } from "sonner";

export default function RoutesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  // Compute skip and take for pagination
  const take = pageSize;
  const skip = currentPage * pageSize;

  useEffect(() => {
    void fetchRoutes();
  }, [currentPage, pageSize]);

  async function fetchRoutes() {
    try {
      setLoading(true);
      setError(null);
      const response = await routeApi.getAllPaginated(currentPage + 1, pageSize);
      setRoutes(response.data);
      setTotalRoutes(response.total);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch routes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(selected: { selected: number }) {
    setCurrentPage(selected.selected);
  }

  function handleCreateRoute() {
    setIsCreateDialogOpen(true);
  }

  function handleUpdateRoute(route: Route) {
    // Validate route has an ID before opening update dialog
    if (!route || !route.id) {
      console.error("Cannot update route: route or route.id is missing", route);
      toast.error("Route ID is missing. Cannot update route.");
      return;
    }
    setSelectedRoute(route);
    setIsUpdateDialogOpen(true);
  }

  async function handleDeleteRoute(routeId: string) {
    if (!confirm("Are you sure you want to delete this route?")) {
      return;
    }

    try {
      await routeApi.deleteRoute(routeId);
      toast.success("Route deleted successfully");
      await fetchRoutes();
    } catch (error: any) {
      console.error("Failed to delete route:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete route";
      toast.error(errorMessage);
    }
  }

  function handleViewMap(route: Route) {
    setSelectedRoute(route);
    setIsMapModalOpen(true);
  }

  return (
    <div className="p-6">
      <RouteStats routes={routes} loading={loading} />

      <RouteList
        routes={routes}
        totalRoutes={totalRoutes}
        loading={loading}
        error={error}
        skip={skip}
        take={take}
        onPageChange={handlePageChange}
        onCreateRoute={handleCreateRoute}
        onUpdateRoute={handleUpdateRoute}
        onDeleteRoute={handleDeleteRoute}
        onViewMap={handleViewMap}
        onRetry={fetchRoutes}
      />

      <CreateRouteForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onRouteCreated={fetchRoutes}
      />

      <UpdateRouteForm
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedRoute(null);
        }}
        route={selectedRoute}
        onRouteUpdated={fetchRoutes}
      />

      {selectedRoute && (
        <RouteMapModal
          open={isMapModalOpen}
          onOpenChange={(open) => {
            setIsMapModalOpen(open);
            if (!open) {
              setSelectedRoute(null);
            }
          }}
          route={selectedRoute}
          onRouteUpdated={(updatedRoute) => {
            // Update the route in the local state
            setRoutes((prevRoutes) =>
              prevRoutes.map((r) => (r.id === updatedRoute.id ? updatedRoute : r))
            );
            setSelectedRoute(updatedRoute);
          }}
        />
      )}
    </div>
  );
}

