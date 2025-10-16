import { Plus, Search, Filter } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Products() {
  const products = [
    { id: 1, code: "PRD001", name: "Coca Cola 500ml", category: "Beverages", pack: "24 units", price: "1,200", stock: 156, status: "Active", image: "🥤" },
    { id: 2, code: "PRD002", name: "Bread Loaf", category: "Bakery", pack: "12 units", price: "800", stock: 45, status: "Active", image: "🍞" },
    { id: 3, code: "PRD003", name: "Rice 1kg", category: "Grains", pack: "20 units", price: "2,500", stock: 89, status: "Active", image: "🌾" },
    { id: 4, code: "PRD004", name: "Milk 1L", category: "Dairy", pack: "12 units", price: "1,500", stock: 23, status: "Low Stock", image: "🥛" },
    { id: 5, code: "PRD005", name: "Cooking Oil 2L", category: "Cooking", pack: "6 units", price: "8,500", stock: 67, status: "Active", image: "🛢️" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Products</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search products..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
              </div>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Product
              </Button>
            </div>

            <Card className="border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Product Code</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Product Name</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Category</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Pack Size</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Price (TZS)</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Stock</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-600">{product.code}</td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{product.image}</span>
                            {product.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{product.category}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{product.pack}</td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">{product.price}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 text-right">{product.stock}</td>
                        <td className="px-4 py-3 text-xs">
                          <Badge variant={product.status === "Active" ? "default" : "destructive"} className="text-xs">
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-right">
                          <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
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
