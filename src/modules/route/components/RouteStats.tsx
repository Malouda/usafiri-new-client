import { Route } from "../interfaces/route.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Route as RouteIcon, CheckCircle, XCircle } from "lucide-react";

interface RouteStatsProps {
  routes: Route[];
  loading: boolean;
}

export function RouteStats({ routes, loading }: RouteStatsProps) {
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter((r) => r.isActive).length;
  const inactiveRoutes = routes.filter((r) => !r.isActive).length;

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
            <RouteIcon className="h-4 w-4" />
            Total Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalRoutes}</div>
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
          <div className="text-2xl font-bold text-green-600">{activeRoutes}</div>
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
          <div className="text-2xl font-bold text-gray-600">{inactiveRoutes}</div>
        </CardContent>
      </Card>
    </div>
  );
}

