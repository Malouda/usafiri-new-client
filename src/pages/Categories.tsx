import { Plus, Search, Edit, Trash2, Eye, Folder, FolderOpen } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Categories() {
  const categories = [
    { id: 1, name: "Beverages", description: "Soft drinks, juices, and water", parentCategory: null, status: "Active", productCount: 45 },
    { id: 2, name: "Soft Drinks", description: "Carbonated beverages", parentCategory: "Beverages", status: "Active", productCount: 25 },
    { id: 3, name: "Juices", description: "Fruit and vegetable juices", parentCategory: "Beverages", status: "Active", productCount: 20 },
    { id: 4, name: "Bakery", description: "Bread, pastries, and baked goods", parentCategory: null, status: "Active", productCount: 32 },
    { id: 5, name: "Fresh Bread", description: "Daily fresh bread products", parentCategory: "Bakery", status: "Active", productCount: 15 },
    { id: 6, name: "Pastries", description: "Cakes, cookies, and sweet treats", parentCategory: "Bakery", status: "Active", productCount: 17 },
    { id: 7, name: "Grains", description: "Rice, wheat, and other grains", parentCategory: null, status: "Active", productCount: 28 },
    { id: 8, name: "Dairy", description: "Milk, cheese, and dairy products", parentCategory: null, status: "Active", productCount: 18 },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Product Categories</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search categories..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-semibold">Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-xs text-gray-600">Category Name</Label>
                      <Input id="name" placeholder="Beverages" className="h-8 text-xs border-gray-200" />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-xs text-gray-600">Description</Label>
                      <Textarea id="description" placeholder="Category description..." className="text-xs border-gray-200" />
                    </div>
                    <div>
                      <Label htmlFor="parent" className="text-xs text-gray-600">Parent Category (Optional)</Label>
                      <Select>
                        <SelectTrigger className="h-8 text-xs border-gray-200">
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beverages" className="text-xs">Beverages</SelectItem>
                          <SelectItem value="bakery" className="text-xs">Bakery</SelectItem>
                          <SelectItem value="grains" className="text-xs">Grains</SelectItem>
                          <SelectItem value="dairy" className="text-xs">Dairy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                      <Button className="h-8 text-xs">Add Category</Button>
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
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Category</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Description</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Parent Category</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Products</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-foreground font-medium">
                          <div className="flex items-center gap-2">
                            {category.parentCategory ? (
                              <FolderOpen className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Folder className="h-4 w-4 text-gray-600" />
                            )}
                            {category.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{category.description}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {category.parentCategory ? (
                            <Badge variant="outline" className="text-xs border-gray-200">{category.parentCategory}</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">{category.productCount}</td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className="bg-success text-white text-xs">{category.status}</Badge>
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
                                  <DialogTitle className="text-xs font-semibold">Category Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{category.name}</div>
                                    <div className="text-xs text-gray-600">{category.description}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="text-gray-600">Parent Category:</span>
                                      <div className="font-medium">{category.parentCategory || "None"}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Products:</span>
                                      <div className="font-medium">{category.productCount}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Status:</span>
                                      <div className="font-medium">{category.status}</div>
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
                                  <DialogTitle className="text-xs font-semibold">Edit Category</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-name" className="text-xs text-gray-600">Category Name</Label>
                                    <Input id="edit-name" defaultValue={category.name} className="h-8 text-xs border-gray-200" />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-description" className="text-xs text-gray-600">Description</Label>
                                    <Textarea id="edit-description" defaultValue={category.description} className="text-xs border-gray-200" />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-parent" className="text-xs text-gray-600">Parent Category</Label>
                                    <Select defaultValue={category.parentCategory?.toLowerCase() || ""}>
                                      <SelectTrigger className="h-8 text-xs border-gray-200">
                                        <SelectValue placeholder="Select parent category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="" className="text-xs">None</SelectItem>
                                        <SelectItem value="beverages" className="text-xs">Beverages</SelectItem>
                                        <SelectItem value="bakery" className="text-xs">Bakery</SelectItem>
                                        <SelectItem value="grains" className="text-xs">Grains</SelectItem>
                                        <SelectItem value="dairy" className="text-xs">Dairy</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button className="h-8 text-xs">Update Category</Button>
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
                                  <DialogTitle className="text-xs font-semibold">Delete Category</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to delete <strong>{category.name}</strong>? This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button variant="destructive" className="h-8 text-xs">Delete Category</Button>
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
