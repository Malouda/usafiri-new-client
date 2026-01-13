import { useState, useEffect, useRef } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TripDetailsModal } from "../components/TripDetailsModal";
import { CreateTripModal } from "../components/CreateTripModal";
import { Trip, TripStatus, TripType } from "../interfaces/trip.interface";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';
import { Bus, Plus, MapPin } from "lucide-react";
import { tripApi } from "../trip.api";
import { toast } from "sonner";
import { useTripTracking } from "../../../hooks/useTripTracking";
import { TripMapModal } from "../components/TripMapModal";

export default function TripList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTrip, setSelectedTripState] = useState<Trip | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [localFilters, setLocalFilters] = useState<{ status?: TripStatus; tripType?: TripType }>({});
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedTripForMap, setSelectedTripForMap] = useState<Trip | null>(null);
  
  // WebSocket tracking
  const { onlineTrips, subscribeToTrips, isTripOnline } = useTripTracking();

  useEffect(() => {
    loadTrips();
  }, [currentPage, pageLimit, localFilters]);

  // Subscribe to trips for GPS tracking when trips are loaded
  // Use a ref to track which trips we've already subscribed to
  const subscribedTripIdsRef = useRef<Set<string>>(new Set());
  const tripsRef = useRef<Trip[]>([]);
  
  useEffect(() => {
    // Only subscribe if trips actually changed (by comparing trip IDs)
    const currentTripIds = trips.map(trip => trip.id).join(',');
    const previousTripIds = tripsRef.current.map(trip => trip.id).join(',');
    
    if (currentTripIds !== previousTripIds && trips.length > 0) {
      tripsRef.current = trips;
      
      // Only subscribe to trips we haven't subscribed to yet
      const newTrips = trips.filter(trip => !subscribedTripIdsRef.current.has(trip.id));
      
      if (newTrips.length > 0) {
        const tripSubscriptions = newTrips.map((trip) => {
          subscribedTripIdsRef.current.add(trip.id);
          return {
            tripId: trip.id,
            sessionId: trip.sessions?.[0]?.id, // Use first session if available
          };
        });
        subscribeToTrips(tripSubscriptions);
      }
      
      // Cleanup: unsubscribe from trips that are no longer in the list
      const currentTripIdSet = new Set(trips.map(trip => trip.id));
      subscribedTripIdsRef.current.forEach(tripId => {
        if (!currentTripIdSet.has(tripId)) {
          subscribedTripIdsRef.current.delete(tripId);
          // Note: We don't call unsubscribeFromTrip here because the hook manages that
          // The cleanup will happen automatically when the component unmounts
        }
      });
    }
  }, [trips, subscribeToTrips]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripApi.getAllPaginated(currentPage, pageLimit, localFilters);
      setTrips(response.data);
      setTotalTrips(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to load trips:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load trips';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTripState(trip);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTripState(null);
  };

  const handleCreateSuccess = () => {
    loadTrips(); // Reload trips after creation
  };

  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected + 1);
  };

  const handleFilterChange = (key: 'status' | 'tripType', value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleOpenMap = (trip: Trip) => {
    setSelectedTripForMap(trip);
    setIsMapModalOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapModalOpen(false);
    setSelectedTripForMap(null);
  };

  // Skeleton loader component
  const TableRowSkeleton = () => (
    <TableRow className="border-gray-200">
      <TableCell className="py-4">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-12" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-4 text-right">
        <Skeleton className="h-7 w-20 ml-auto" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Available Trips</h1>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="text-xs h-8">
          <Plus className="h-3 w-3 mr-1" />
          Create Trip
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Select
          value={localFilters.status || "all"}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-40 h-8 text-xs border-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Status</SelectItem>
            <SelectItem value="PUBLISHED" className="text-xs">Published</SelectItem>
            <SelectItem value="IN_PROGRESS" className="text-xs">In Progress</SelectItem>
            <SelectItem value="COMPLETED" className="text-xs">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={localFilters.tripType || "all"}
          onValueChange={(value) => handleFilterChange('tripType', value)}
        >
          <SelectTrigger className="w-40 h-8 text-xs border-gray-200">
            <SelectValue placeholder="Trip Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Types</SelectItem>
            <SelectItem value="NON_REPEATING" className="text-xs">Daily Shuttle</SelectItem>
            <SelectItem value="REPEATING" className="text-xs">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-gray-200">
              <TableHead className="text-xs text-gray-600">Route</TableHead>
              <TableHead className="text-xs text-gray-600">Type</TableHead>
              <TableHead className="text-xs text-gray-600">Status</TableHead>
              <TableHead className="text-xs text-gray-600">Date Range</TableHead>
              <TableHead className="text-xs text-gray-600">Price</TableHead>
              <TableHead className="text-xs text-gray-600">Seats</TableHead>
              <TableHead className="text-xs text-gray-600">Online</TableHead>
              <TableHead className="text-xs text-gray-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, index) => <TableRowSkeleton key={index} />)
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Alert variant="destructive" className="mx-auto max-w-md">
                    <AlertDescription className="text-xs text-gray-600">{error}</AlertDescription>
                  </Alert>
                  <Button
                    variant="outline"
                    className="mt-4 border-gray-200 text-xs"
                    onClick={loadTrips}
                  >
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Bus className="mx-auto h-12 w-12 text-gray-400 opacity-30" />
                  <h3 className="mt-4 text-sm font-medium text-gray-700">No trips found</h3>
                  <p className="mt-2 text-xs text-gray-500">
                    There are no trips available matching your filters.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              trips.map((trip, index) => (
                <TableRow key={trip.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="text-xs text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">{trip.route?.name || 'Unknown Route'}</p>
                      <p className="text-gray-600">{trip.route?.stops?.length || 0} stops</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    <Badge variant="outline" className="text-xs">
                      {trip.tripType === 'NON_REPEATING' ? 'Daily' : 'Flexible'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    <Badge
                      variant={trip.status === 'PUBLISHED' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    <div>
                      <p>{format(new Date(trip.startDate), 'MMM d, yyyy')}</p>
                      <p className="text-gray-600">to {format(new Date(trip.endDate), 'MMM d')}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 font-medium">
                    {(() => {
                      // Handle price display - API returns pricePerDayCents, interface expects basePrice
                      const priceCents = trip.basePriceCents || (trip as any).pricePerDayCents;
                      const currency = trip.currency || 'TZS';
                      
                      if (priceCents !== undefined && priceCents !== null) {
                        // Convert cents to base price (divide by 100)
                        const priceInCents = typeof priceCents === 'string' ? parseFloat(priceCents) : priceCents;
                        const basePrice = priceInCents / 100;
                        return `${currency} ${basePrice.toLocaleString()}`;
                      }
                      
                      // Fallback if basePrice exists
                      if (trip.basePrice !== undefined && trip.basePrice !== null) {
                        return `${currency} ${trip.basePrice.toLocaleString()}`;
                      }
                      
                      return 'N/A';
                    })()}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {trip.bus?.numberOfSeats || 0}
                  </TableCell>
                  <TableCell>
                    {onlineTrips[trip.id]?.isOnline ? (
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="Online" />
                        <span className="text-xs text-gray-600">Online</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Offline</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenMap(trip)}
                        className="text-xs h-7"
                        title="View on map"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Map
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(trip)}
                        className="text-xs h-7"
                      >
                        View Details
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
      {!loading && !error && totalTrips > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Showing {(currentPage - 1) * pageLimit + 1} to{' '}
            {Math.min(currentPage * pageLimit, totalTrips)} of {totalTrips} trips
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            forcePage={currentPage - 1}
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

      {/* Create Trip Modal */}
      <CreateTripModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Details Modal */}
      <TripDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={handleCloseDetailsModal}
        trip={selectedTrip}
      />

      {/* Map Modal */}
      {selectedTripForMap && (
        <TripMapModal
          open={isMapModalOpen}
          onOpenChange={handleCloseMap}
          trip={selectedTripForMap}
        />
      )}
    </div>
  );
}

