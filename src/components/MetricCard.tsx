import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period?: string;
}

export function MetricCard({ title, value, change, isPositive, period = "Last 30 days" }: MetricCardProps) {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xs font-normal text-muted-foreground flex items-center gap-1">
          {title}
          <ExternalLink className="h-3 w-3" />
        </h3>
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-semibold text-foreground">{value}</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{change}</span>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="h-7 w-32 text-xs border-none bg-transparent text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
