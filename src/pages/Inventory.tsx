import { Plus, Search, TrendingDown, AlertTriangle, Edit, Eye, Package } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Inventory() {
  const inventory = [
    { id: 1, product: "Coca Cola 500ml", sku: "PRD001", inStock: 156, reorderLevel: 50, lastRestocked: "2025-10-14", status: "Good" },
    { id: 2, product: "Bread Loaf", sku: "PRD002", inStock: 45, reorderLevel: 30, lastRestocked: "2025-10-15", status: "Good" },
    { id: 3, product: "Rice 1kg", sku: "PRD003", inStock: 89, reorderLevel: 100, lastRestocked: "2025-10-10", status: "Good" },
    { id: 4, product: "Milk 1L", sku: "PRD004", inStock: 23, reorderLevel: 40, lastRestocked: "2025-10-13", status: "Low" },
    { id: 5, product: "Cooking Oil 2L", sku: "PRD005", inStock: 8, reorderLevel: 20, lastRestocked: "2025-10-08", status: "Critical" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Inventory Management</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <MetricCard title="Total Products" value="248" change="+12%" isPositive={true} />
              <MetricCard title="Low Stock Items" value="8" change="+3" isPositive={false} />
              <MetricCard title="Out of Stock" value="2" change="-1" isPositive={true} />
              <MetricCard title="Stock Value" value="45.2M TZS" change="+5.2%" isPositive={true} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search inventory..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200">
                  <Package className="h-3 w-3 mr-1" />
                  Receive Stock
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Stock Adjustment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xs font-semibold">Stock Adjustment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="product" className="text-xs text-gray-600">Product</Label>
                        <Select>
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coca-cola" className="text-xs">Coca Cola 500ml</SelectItem>
                            <SelectItem value="bread" className="text-xs">Bread Loaf</SelectItem>
                            <SelectItem value="rice" className="text-xs">Rice 1kg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="adjustmentType" className="text-xs text-gray-600">Adjustment Type</Label>
                          <Select>
                            <SelectTrigger className="h-8 text-xs border-gray-200">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="addition" className="text-xs">Stock Addition</SelectItem>
                              <SelectItem value="deduction" className="text-xs">Stock Deduction</SelectItem>
                              <SelectItem value="adjustment" className="text-xs">Stock Adjustment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="quantity" className="text-xs text-gray-600">Quantity</Label>
                          <Input id="quantity" placeholder="0" className="h-8 text-xs border-gray-200" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="reason" className="text-xs text-gray-600">Reason</Label>
                        <Input id="reason" placeholder="Stock adjustment reason..." className="h-8 text-xs border-gray-200" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                        <Button className="h-8 text-xs">Apply Adjustment</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">SKU</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Product Name</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">In Stock</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Reorder Level</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Last Restocked</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-600">{item.sku}</td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{item.product}</td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">{item.inStock}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 text-right">{item.reorderLevel}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{item.lastRestocked}</td>
                        <td className="px-4 py-3 text-xs">
                          {item.status === "Good" && <Badge className="bg-success text-white text-xs">Good Stock</Badge>}
                          {item.status === "Low" && <Badge className="bg-orange-500 text-white text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />Low Stock
                          </Badge>}
                          {item.status === "Critical" && <Badge variant="destructive" className="text-xs">
                            <TrendingDown className="h-3 w-3 mr-1" />Critical
                          </Badge>}
                        </td>
                        <td className="px-4 py-3 text-xs text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
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
