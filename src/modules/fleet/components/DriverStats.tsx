import { Driver, UserStatus } from "../interfaces/driver.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, Ban } from "lucide-react";

interface DriverStatsProps {
  drivers: Driver[];
  loading: boolean;
}

export function DriverStats({ drivers, loading }: DriverStatsProps) {
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter((d) => d.status === UserStatus.ACTIVE).length;
  const inactiveDrivers = drivers.filter((d) => d.status === UserStatus.INACTIVE).length;
  const suspendedDrivers = drivers.filter((d) => d.status === UserStatus.SUSPENDED).length;

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
            <Users className="h-4 w-4" />
            Total Drivers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalDrivers}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-green-600" />
            Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeDrivers}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <UserX className="h-4 w-4 text-gray-600" />
            Inactive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{inactiveDrivers}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-600" />
            Suspended
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{suspendedDrivers}</div>
        </CardContent>
      </Card>
    </div>
  );
}

