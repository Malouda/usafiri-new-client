import { Stop } from "../interfaces";
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
import { MapPin, Edit, Trash2, Plus, Volume2, VolumeX, Play, Pause, Loader2, X, RefreshCw } from "lucide-react";
import ReactPaginate from "react-paginate";

interface StopListProps {
  stops: Stop[];
  totalStops: number;
  loading: boolean;
  error: string | null;
  skip: number;
  take: number;
  onPageChange: (selected: { selected: number }) => void;
  onCreateStop: () => void;
  onUpdateStop: (stop: Stop) => void;
  onDeleteStop: (stopId: string) => void;
  onGenerateAudio?: (stopId: string) => void;
  onDeleteAudio?: (stopId: string) => void;
  onPlayAudio?: (stopId: string) => void;
  generatingAudio?: string | null; // stopId that is currently generating audio
  playingAudio?: string | null; // stopId that is currently playing
  loadingAudio?: string | null; // stopId that is loading presigned URL
  onRetry: () => void;
}

export function StopList({
  stops,
  totalStops,
  loading,
  error,
  skip,
  take,
  onPageChange,
  onCreateStop,
  onUpdateStop,
  onDeleteStop,
  onGenerateAudio,
  onDeleteAudio,
  onPlayAudio,
  generatingAudio,
  playingAudio,
  loadingAudio,
  onRetry,
}: StopListProps) {
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
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20" />
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
        <h2 className="text-lg font-semibold text-gray-900">Stops</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={loading}
            className="text-xs h-8"
            title="Refresh stops list"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={onCreateStop} className="text-xs h-8">
            <Plus className="h-3 w-3 mr-1" />
            Create Stop
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-gray-200">
              <TableHead className="text-xs text-gray-600">No.</TableHead>
              <TableHead className="text-xs text-gray-600">Name</TableHead>
              <TableHead className="text-xs text-gray-600">Latitude</TableHead>
              <TableHead className="text-xs text-gray-600">Longitude</TableHead>
              <TableHead className="text-xs text-gray-600">Audio</TableHead>
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
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-xs text-red-600 mb-4">{error}</p>
                  <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : stops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400 opacity-30" />
                  <h3 className="mt-4 text-sm font-medium text-gray-700">No stops found</h3>
                  <p className="mt-2 text-xs text-gray-500">
                    Get started by creating your first stop.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateStop}
                    className="mt-4 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create Stop
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              stops.map((stop, index) => {
                // Convert latitude/longitude to numbers if they're strings (decimal types from DB)
                const latitude = typeof stop.latitude === 'string' 
                  ? parseFloat(stop.latitude) 
                  : stop.latitude;
                const longitude = typeof stop.longitude === 'string' 
                  ? parseFloat(stop.longitude) 
                  : stop.longitude;
                
                return (
                  <TableRow key={stop.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell className="text-xs text-gray-600 font-medium">
                      {skip + index + 1}
                    </TableCell>
                    <TableCell className="text-xs text-gray-900 font-medium">{stop.name}</TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {!isNaN(latitude) ? latitude.toFixed(6) : stop.latitude}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {!isNaN(longitude) ? longitude.toFixed(6) : stop.longitude}
                    </TableCell>
                    <TableCell>
                      {stop.audioUrl ? (
                        <div className="flex items-center gap-1">
                          {loadingAudio === stop.id ? (
                            <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
                          ) : playingAudio === stop.id ? (
                            <Pause className="h-3 w-3 text-blue-600" />
                          ) : (
                            <Play className="h-3 w-3 text-green-600" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onPlayAudio) {
                                onPlayAudio(stop.id);
                              }
                            }}
                            disabled={loadingAudio === stop.id}
                            className="h-6 px-2 text-xs hover:bg-gray-100"
                            title={playingAudio === stop.id ? "Pause audio" : "Play audio announcement"}
                          >
                            {loadingAudio === stop.id
                              ? "Loading..."
                              : playingAudio === stop.id
                              ? "Pause"
                              : "Play"}
                          </Button>
                          {onDeleteAudio && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAudio(stop.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-50"
                              title="Delete audio file"
                            >
                              <X className="h-3 w-3 text-red-600" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <VolumeX className="h-3 w-3 text-gray-400" />
                          {onGenerateAudio && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onGenerateAudio(stop.id);
                              }}
                              disabled={generatingAudio === stop.id}
                              className="h-6 px-2 text-xs"
                              title="Generate audio announcement"
                            >
                              {generatingAudio === stop.id ? "Generating..." : "Generate"}
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          stop.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {stop.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateStop(stop)}
                          className="h-7 w-7 p-0"
                          title="Edit stop"
                        >
                          <Edit className="h-3 w-3 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteStop(stop.id)}
                          className="h-7 w-7 p-0"
                          title="Delete stop"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalStops > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Showing {skip + 1} to {Math.min(skip + take, totalStops)} of {totalStops} stops
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalStops / take)}
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

