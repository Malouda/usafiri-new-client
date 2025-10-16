import { Search, Filter, CheckCircle, Clock, XCircle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";

export default function Payments() {
  const payments = [
    { id: 1, txnId: "TXN001234", customer: "John Doe", phone: "+255 714 123 456", network: "Vodacom (M-Pesa)", amount: "45,000", tariff: "800", total: "45,800", method: "M-Pesa", status: "Completed", date: "2025-10-16 09:23" },
    { id: 2, txnId: "TXN001235", customer: "Jane Smith", phone: "-", network: "-", amount: "128,500", tariff: "0", total: "128,500", method: "Cash", status: "Completed", date: "2025-10-16 10:15" },
    { id: 3, txnId: "TXN001236", customer: "Hassan Ali", phone: "+255 689 234 567", network: "Airtel (Airtel Money)", amount: "67,200", tariff: "0", total: "67,200", method: "Bank Transfer", status: "Pending", date: "2025-10-16 11:42" },
    { id: 4, txnId: "TXN001237", customer: "Mary Kimaro", phone: "-", network: "-", amount: "32,900", tariff: "0", total: "32,900", method: "Card", status: "Completed", date: "2025-10-16 12:08" },
    { id: 5, txnId: "TXN001238", customer: "Grace Mollel", phone: "+255 765 789 012", network: "Vodacom (M-Pesa)", amount: "15,600", tariff: "0", total: "15,600", method: "M-Pesa", status: "Failed", date: "2025-10-16 13:35" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Payments</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <MetricCard title="Total Revenue Today" value="2.8M TZS" change="+18.2%" isPositive={true} />
              <MetricCard title="Completed Payments" value="156" change="+12" isPositive={true} />
              <MetricCard title="Pending Payments" value="8" change="+2" isPositive={false} />
              <MetricCard title="Failed Payments" value="3" change="-1" isPositive={true} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search transactions..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
              </div>
            </div>

            <Card className="border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Transaction ID</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Customer</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Phone / Network</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Amount</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Tariff</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Total (TZS)</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Method</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Date & Time</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-600">{payment.txnId}</td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{payment.customer}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div className="flex flex-col gap-0.5">
                            <span>{payment.phone}</span>
                            {payment.network !== "-" && (
                              <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded w-fit">{payment.network}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 text-right">{payment.amount}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 text-right">{payment.tariff}</td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">{payment.total}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{payment.method}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{payment.date}</td>
                        <td className="px-4 py-3 text-xs">
                          {payment.status === "Completed" && (
                            <Badge className="bg-success text-white text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {payment.status === "Pending" && (
                            <Badge className="bg-orange-500 text-white text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {payment.status === "Failed" && (
                            <Badge variant="destructive" className="text-xs">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-right">
                          <Button variant="ghost" size="sm" className="h-6 text-xs">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
