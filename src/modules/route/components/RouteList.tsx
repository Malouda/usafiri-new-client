import { Route } from "../interfaces/route.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Route as RouteIcon, Edit, Trash2, Plus, Map as MapIcon } from "lucide-react";
import ReactPaginate from "react-paginate";

interface RouteListProps {
  routes: Route[];
  totalRoutes: number;
  loading: boolean;
  error: string | null;
  skip: number;
  take: number;
  onPageChange: (selected: { selected: number }) => void;
  onCreateRoute: () => void;
  onUpdateRoute: (route: Route) => void;
  onDeleteRoute: (routeId: string) => void;
  onViewMap: (route: Route) => void;
  onRetry: () => void;
}

export function RouteList({
  routes,
  totalRoutes,
  loading,
  error,
  skip,
  take,
  onPageChange,
  onCreateRoute,
  onUpdateRoute,
  onDeleteRoute,
  onViewMap,
  onRetry,
}: RouteListProps) {
  const TableRowSkeleton = () => (
    <TableRow className="border-gray-200">
      <TableCell className="py-4">
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-4 text-right">
        <Skeleton className="h-7 w-16 ml-auto" />
      </TableCell>
    </TableRow>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Routes</h2>
        <Button size="sm" onClick={onCreateRoute} className="text-xs h-8">
          <Plus className="h-3 w-3 mr-1" />
          Create Route
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-gray-200">
              <TableHead className="text-xs text-gray-600">No.</TableHead>
              <TableHead className="text-xs text-gray-600">Route Name</TableHead>
              <TableHead className="text-xs text-gray-600">Description</TableHead>
              <TableHead className="text-xs text-gray-600">Stops</TableHead>
              <TableHead className="text-xs text-gray-600">Status</TableHead>
              <TableHead className="text-xs text-gray-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, index) => <TableRowSkeleton key={index} />)
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-xs text-red-600 mb-4">{error}</p>
                  <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <RouteIcon className="mx-auto h-12 w-12 text-gray-400 opacity-30" />
                  <h3 className="mt-4 text-sm font-medium text-gray-700">No routes found</h3>
                  <p className="mt-2 text-xs text-gray-500">
                    Get started by creating your first route.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateRoute}
                    className="mt-4 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create Route
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              routes.map((route, index) => (
                <TableRow key={route.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="text-xs text-gray-600 font-medium">
                    {skip + index + 1}
                  </TableCell>
                  <TableCell className="text-xs text-gray-900 font-medium">{route.name}</TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {route.description || "-"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {route.routeStops?.length || 0} stops
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        route.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {route.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewMap(route)}
                        className="h-7 w-7 p-0"
                        title="View route map"
                      >
                        <MapIcon className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateRoute(route)}
                        className="h-7 w-7 p-0"
                        title="Edit route"
                      >
                        <Edit className="h-3 w-3 text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteRoute(route.id)}
                        className="h-7 w-7 p-0"
                        title="Delete route"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalRoutes > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Showing {skip + 1} to {Math.min(skip + take, totalRoutes)} of {totalRoutes} routes
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalRoutes / take)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={onPageChange}
            forcePage={Math.floor(skip / take)}
            containerClassName={"flex gap-2"}
            activeClassName={"bg-gray-100"}
            pageClassName={
              "flex items-center justify-center h-8 w-8 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
            }
            previousClassName={
              "flex items-center justify-center h-8 w-8 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
            }
            nextClassName={
              "flex items-center justify-center h-8 w-8 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
            }
            disabledClassName={"opacity-50 cursor-not-allowed"}
            activeLinkClassName={"font-medium"}
          />
        </div>
      )}
    </div>
  );
}

