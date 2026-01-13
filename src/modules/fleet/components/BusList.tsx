import { Bus, BusStatus } from "../interfaces/bus.interface";
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
import { Bus as BusIcon, Edit, Trash2, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

interface BusListProps {
  buses: Bus[];
  totalBuses: number;
  loading: boolean;
  error: string | null;
  skip: number;
  take: number;
  onPageChange: (selected: { selected: number }) => void;
  onCreateBus: () => void;
  onUpdateBus: (bus: Bus) => void;
  onDeleteBus: (busId: string) => void;
  onRetry: () => void;
}

export function BusList({
  buses,
  totalBuses,
  loading,
  error,
  skip,
  take,
  onPageChange,
  onCreateBus,
  onUpdateBus,
  onDeleteBus,
  onRetry,
}: BusListProps) {
  const navigate = useNavigate();

  const handleBusClick = (busId: string) => {
    navigate(`/fleet/buses/${busId}`);
  };

  const getStatusColor = (status: BusStatus) => {
    switch (status) {
      case BusStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case BusStatus.MAINTENANCE:
        return "bg-orange-100 text-orange-800";
      case BusStatus.INACTIVE:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const TableRowSkeleton = () => (
    <TableRow className="border-gray-200">
      <TableCell className="py-4">
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-12" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20" />
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
        <h2 className="text-lg font-semibold text-gray-900">Fleet Buses</h2>
        <Button size="sm" onClick={onCreateBus} className="text-xs h-8">
          <Plus className="h-3 w-3 mr-1" />
          Register Bus
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-gray-200">
              <TableHead className="text-xs text-gray-600">No.</TableHead>
              <TableHead className="text-xs text-gray-600">Plate Number</TableHead>
              <TableHead className="text-xs text-gray-600">Make</TableHead>
              <TableHead className="text-xs text-gray-600">Model</TableHead>
              <TableHead className="text-xs text-gray-600">Seats</TableHead>
              <TableHead className="text-xs text-gray-600">Status</TableHead>
              <TableHead className="text-xs text-gray-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, index) => <TableRowSkeleton key={index} />)
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-xs text-red-600 mb-4">{error}</p>
                  <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : buses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <BusIcon className="mx-auto h-12 w-12 text-gray-400 opacity-30" />
                  <h3 className="mt-4 text-sm font-medium text-gray-700">No buses found</h3>
                  <p className="mt-2 text-xs text-gray-500">
                    Get started by registering your first bus.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateBus}
                    className="mt-4 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Register Bus
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              buses.map((bus, index) => (
                <TableRow 
                  key={bus.id} 
                  className="border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleBusClick(bus.id)}
                >
                  <TableCell className="text-xs text-gray-600 font-medium">
                    {skip + index + 1}
                  </TableCell>
                  <TableCell className="text-xs text-gray-900 font-medium">
                    {bus.plateNumber}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {bus.makeEntity?.name || "-"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {bus.modelEntity?.name || "-"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">{bus.numberOfSeats}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(bus.status)}`}>
                      {bus.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBusClick(bus.id)}
                        className="h-7 w-7 p-0"
                        title="View bus details"
                      >
                        <Eye className="h-3 w-3 text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateBus(bus)}
                        className="h-7 w-7 p-0"
                        title="Edit bus"
                      >
                        <Edit className="h-3 w-3 text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteBus(bus.id)}
                        className="h-7 w-7 p-0"
                        title="Delete bus"
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
      {!loading && !error && totalBuses > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Showing {skip + 1} to {Math.min(skip + take, totalBuses)} of {totalBuses} buses
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalBuses / take)}
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

