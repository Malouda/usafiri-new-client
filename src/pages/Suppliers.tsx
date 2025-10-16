import { Plus, Search, Phone, Mail } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";

export default function Suppliers() {
  const suppliers = [
    { id: 1, code: "SUP001", name: "Coca Cola Kwanza Ltd", contact: "John Mwamba", phone: "+255 714 123 456", email: "john@cocacola.co.tz", balance: "5,420,000", status: "Active" },
    { id: 2, code: "SUP002", name: "Tanzania Bakery Supply", contact: "Mary Kimaro", phone: "+255 765 789 012", email: "mary@tbs.co.tz", balance: "2,150,000", status: "Active" },
    { id: 3, code: "SUP003", name: "East Africa Grains", contact: "Hassan Ali", phone: "+255 713 456 789", email: "hassan@eagrains.com", balance: "8,900,000", status: "Active" },
    { id: 4, code: "SUP004", name: "Tanga Dairy Products", contact: "Grace Mollel", phone: "+255 784 234 567", email: "grace@tangadairy.co.tz", balance: "1,250,000", status: "Active" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Suppliers</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <MetricCard title="Total Suppliers" value="42" change="+3" isPositive={true} />
              <MetricCard title="Active Purchase Orders" value="12" change="+5" isPositive={true} />
              <MetricCard title="Total Payables" value="18.7M TZS" change="+12%" isPositive={false} />
              <MetricCard title="Pending Deliveries" value="8" change="-2" isPositive={true} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search suppliers..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
              </div>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Supplier
              </Button>
            </div>

            <Card className="border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Supplier Code</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Supplier Name</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Contact Person</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Contact Info</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Balance (TZS)</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-600">{supplier.code}</td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{supplier.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{supplier.contact}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{supplier.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{supplier.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">{supplier.balance}</td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className="bg-success text-white text-xs">{supplier.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-right">
                          <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
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
