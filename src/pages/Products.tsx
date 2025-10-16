import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
              <Dialog>
                <DialogTrigger asChild>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Product
              </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-semibold">Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="code" className="text-xs text-gray-600">Product Code</Label>
                        <Input id="code" placeholder="PRD001" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="name" className="text-xs text-gray-600">Product Name</Label>
                        <Input id="name" placeholder="Coca Cola 500ml" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-xs text-gray-600">Category</Label>
                        <Select>
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beverages" className="text-xs">Beverages</SelectItem>
                            <SelectItem value="bakery" className="text-xs">Bakery</SelectItem>
                            <SelectItem value="grains" className="text-xs">Grains</SelectItem>
                            <SelectItem value="dairy" className="text-xs">Dairy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-xs text-gray-600">Price (TZS)</Label>
                        <Input id="price" placeholder="1,200" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="packSize" className="text-xs text-gray-600">Pack Size</Label>
                        <Input id="packSize" placeholder="24 units" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="stock" className="text-xs text-gray-600">Initial Stock</Label>
                        <Input id="stock" placeholder="100" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-xs text-gray-600">Description</Label>
                      <Textarea id="description" placeholder="Product description..." className="text-xs border-gray-200" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                      <Button className="h-8 text-xs">Add Product</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                          <div className="flex items-center gap-1 justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-xs font-semibold">Product Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{product.image}</span>
                                    <div>
                                      <div className="text-sm font-medium text-foreground">{product.name}</div>
                                      <div className="text-xs text-gray-600">{product.code}</div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="text-gray-600">Category:</span>
                                      <div className="font-medium">{product.category}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Pack Size:</span>
                                      <div className="font-medium">{product.pack}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Price:</span>
                                      <div className="font-medium">{product.price} TZS</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Stock:</span>
                                      <div className="font-medium">{product.stock}</div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-xs font-semibold">Edit Product</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-code" className="text-xs text-gray-600">Product Code</Label>
                                      <Input id="edit-code" defaultValue={product.code} className="h-8 text-xs border-gray-200" />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-name" className="text-xs text-gray-600">Product Name</Label>
                                      <Input id="edit-name" defaultValue={product.name} className="h-8 text-xs border-gray-200" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-category" className="text-xs text-gray-600">Category</Label>
                                      <Select defaultValue={product.category.toLowerCase()}>
                                        <SelectTrigger className="h-8 text-xs border-gray-200">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="beverages" className="text-xs">Beverages</SelectItem>
                                          <SelectItem value="bakery" className="text-xs">Bakery</SelectItem>
                                          <SelectItem value="grains" className="text-xs">Grains</SelectItem>
                                          <SelectItem value="dairy" className="text-xs">Dairy</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-price" className="text-xs text-gray-600">Price (TZS)</Label>
                                      <Input id="edit-price" defaultValue={product.price} className="h-8 text-xs border-gray-200" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-pack" className="text-xs text-gray-600">Pack Size</Label>
                                      <Input id="edit-pack" defaultValue={product.pack} className="h-8 text-xs border-gray-200" />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-stock" className="text-xs text-gray-600">Stock</Label>
                                      <Input id="edit-stock" defaultValue={product.stock} className="h-8 text-xs border-gray-200" />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button className="h-8 text-xs">Update Product</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-danger hover:text-danger">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-xs font-semibold">Delete Product</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button variant="destructive" className="h-8 text-xs">Delete Product</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
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
