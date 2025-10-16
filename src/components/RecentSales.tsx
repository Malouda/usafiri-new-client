import { Card } from "@/components/ui/card";
import { ExternalLink, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sales = [
  { id: "TXN001234", customer: "John Doe", amount: "45,800 TZS", time: "09:23 AM", status: "completed" },
  { id: "TXN001235", customer: "Jane Smith", amount: "128,500 TZS", time: "10:15 AM", status: "completed" },
  { id: "TXN001236", customer: "Hassan Ali", amount: "67,200 TZS", time: "11:42 AM", status: "pending" },
  { id: "TXN001237", customer: "Mary Kimaro", amount: "32,900 TZS", time: "12:08 PM", status: "completed" },
];

export function RecentSales() {
  return (
    <Card className="p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal text-gray-600 flex items-center gap-1">
          Recent Sales
          <ExternalLink className="h-3 w-3" />
        </h3>
      </div>
      
      <div className="space-y-3">
        {sales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-foreground">{sale.customer}</div>
              <div className="text-xs text-gray-600">{sale.id} • {sale.time}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-xs font-semibold text-foreground">{sale.amount}</div>
              {sale.status === "completed" ? (
                <Badge className="bg-success text-white text-xs h-4 px-1">
                  <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                  Paid
                </Badge>
              ) : (
                <Badge className="bg-orange-500 text-white text-xs h-4 px-1">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  Pending
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
