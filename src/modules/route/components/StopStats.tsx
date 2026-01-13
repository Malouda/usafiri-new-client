import { Stop } from "../interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, CheckCircle, XCircle } from "lucide-react";

interface StopStatsProps {
  stops: Stop[];
  loading: boolean;
}

export function StopStats({ stops, loading }: StopStatsProps) {
  const totalStops = stops.length;
  const activeStops = stops.filter((s) => s.isActive).length;
  const inactiveStops = stops.filter((s) => !s.isActive).length;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-gray-200">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Total Stops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalStops}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeStops}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-gray-600" />
            Inactive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{inactiveStops}</div>
        </CardContent>
      </Card>
    </div>
  );
}

