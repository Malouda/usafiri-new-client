import { Card } from "@/components/ui/card";
import { ExternalLink, Package, AlertTriangle, TrendingDown } from "lucide-react";

const stockData = [
  { label: "In Stock", value: "248", icon: Package, color: "text-success" },
  { label: "Low Stock", value: "8", icon: AlertTriangle, color: "text-orange-500" },
  { label: "Out of Stock", value: "2", icon: TrendingDown, color: "text-danger" },
];

const categories = [
  { name: "Beverages", count: "45" },
  { name: "Bakery", count: "38" },
  { name: "Grains", count: "52" },
  { name: "Dairy", count: "28" },
  { name: "Other", count: "85" },
];

export function StockSummary() {
  return (
    <Card className="p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal text-gray-600 flex items-center gap-1">
          Stock Summary
          <ExternalLink className="h-3 w-3" />
        </h3>
      </div>
      
      <div className="space-y-3 mb-4">
        {stockData.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
              <span className={`text-xs font-semibold ${item.color}`}>{item.value}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="text-xs font-medium text-gray-600 mb-2">By Category</div>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{cat.name}</span>
              <span className="text-xs font-semibold text-foreground">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
