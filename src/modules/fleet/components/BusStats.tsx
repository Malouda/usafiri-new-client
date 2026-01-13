import { Bus, BusStatus } from "../interfaces/bus.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bus as BusIcon, Wrench, CircleSlash } from "lucide-react";

interface BusStatsProps {
  buses: Bus[];
  loading: boolean;
}

export function BusStats({ buses, loading }: BusStatsProps) {
  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.status === BusStatus.ACTIVE).length;
  const maintenanceBuses = buses.filter((b) => b.status === BusStatus.MAINTENANCE).length;
  const inactiveBuses = buses.filter((b) => b.status === BusStatus.INACTIVE).length;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <BusIcon className="h-4 w-4" />
            Total Buses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalBuses}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <BusIcon className="h-4 w-4 text-green-600" />
            Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeBuses}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-orange-600" />
            Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{maintenanceBuses}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <CircleSlash className="h-4 w-4 text-gray-600" />
            Inactive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{inactiveBuses}</div>
        </CardContent>
      </Card>
    </div>
  );
}

