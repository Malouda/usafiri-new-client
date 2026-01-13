import { Model } from "../interfaces/model.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Users } from "lucide-react";

interface ModelStatsProps {
  models: Model[];
  loading: boolean;
}

export function ModelStats({ models, loading }: ModelStatsProps) {
  const totalModels = models.length;
  const modelsWithSeats = models.filter((m) => m.typicalSeats).length;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2].map((i) => (
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
            <Car className="h-4 w-4" />
            Total Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalModels}</div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            With Seat Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{modelsWithSeats}</div>
        </CardContent>
      </Card>
    </div>
  );
}

