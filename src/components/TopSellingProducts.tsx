import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const products = [
  { name: "Coca Cola 500ml", category: "Beverages", sales: "1,245", revenue: "1.5M TZS" },
  { name: "Bread Loaf", category: "Bakery", sales: "892", revenue: "714K TZS" },
  { name: "Rice 1kg", category: "Grains", sales: "678", revenue: "1.7M TZS" },
  { name: "Cooking Oil 2L", category: "Cooking", sales: "445", revenue: "3.8M TZS" },
];

export function TopSellingProducts() {
  return (
    <Card className="p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal text-gray-600 flex items-center gap-1">
          Top Selling Products
          <ExternalLink className="h-3 w-3" />
        </h3>
      </div>
      
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.name} className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-foreground">{product.name}</div>
              <div className="text-xs text-gray-600">{product.sales} units sold</div>
            </div>
            <div className="text-xs font-semibold text-foreground">{product.revenue}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
