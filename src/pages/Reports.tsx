import { Download, TrendingUp } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { RevenueChart } from "@/components/RevenueChart";
import { TransactionChart } from "@/components/TransactionChart";

export default function Reports() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Reports & Analytics</h1>
              <Button size="sm" className="h-8 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export Report
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <MetricCard title="Total Revenue (Month)" value="45.2M TZS" change="+23.8%" isPositive={true} />
              <MetricCard title="Total Profit" value="12.8M TZS" change="+18.2%" isPositive={true} />
              <MetricCard title="Total Sales" value="1,245" change="+12.5%" isPositive={true} />
              <MetricCard title="Avg Transaction" value="36,300 TZS" change="+5.2%" isPositive={true} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="p-4 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-foreground">Revenue Growth</h3>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+23.8%</span>
                  </div>
                </div>
                <RevenueChart />
              </Card>

              <Card className="p-4 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-foreground">Transaction Volume</h3>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <TransactionChart />
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-gray-200">
                <h3 className="text-xs font-medium text-foreground mb-3">Top Selling Products</h3>
                <div className="space-y-2">
                  {[
                    { name: "Coca Cola 500ml", sales: "1,245", revenue: "1.5M" },
                    { name: "Bread Loaf", sales: "892", revenue: "714K" },
                    { name: "Rice 1kg", sales: "678", revenue: "1.7M" },
                    { name: "Cooking Oil 2L", sales: "445", revenue: "3.8M" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                      <div>
                        <div className="text-xs font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-gray-600">{item.sales} units sold</div>
                      </div>
                      <div className="text-xs font-semibold text-foreground">{item.revenue} TZS</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 border-gray-200">
                <h3 className="text-xs font-medium text-foreground mb-3">Payment Methods Distribution</h3>
                <div className="space-y-2">
                  {[
                    { method: "M-Pesa", percentage: "45%", amount: "20.3M" },
                    { method: "Cash", percentage: "32%", amount: "14.5M" },
                    { method: "Bank Transfer", percentage: "15%", amount: "6.8M" },
                    { method: "Card", percentage: "8%", amount: "3.6M" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{item.method}</span>
                        <span className="font-medium text-foreground">{item.amount} TZS</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success" 
                          style={{ width: item.percentage }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
