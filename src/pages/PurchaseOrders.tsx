import { Plus, Search, Edit, Trash2, Eye, FileText, Package, CheckCircle, Clock, XCircle } from "lucide-react";
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

export default function PurchaseOrders() {
  const purchaseOrders = [
    { 
      id: 1, 
      poNumber: "PO-2024-001", 
      supplier: "Coca Cola Kwanza Ltd", 
      totalAmount: "1,200,000", 
      status: "Received", 
      orderDate: "2024-10-10", 
      expectedDelivery: "2024-10-15", 
      receivedDate: "2024-10-14",
      items: 5
    },
    { 
      id: 2, 
      poNumber: "PO-2024-002", 
      supplier: "Tanzania Bakery Supply", 
      totalAmount: "450,000", 
      status: "Partially Received", 
      orderDate: "2024-10-12", 
      expectedDelivery: "2024-10-18", 
      receivedDate: null,
      items: 3
    },
    { 
      id: 3, 
      poNumber: "PO-2024-003", 
      supplier: "East Africa Grains", 
      totalAmount: "2,800,000", 
      status: "Submitted", 
      orderDate: "2024-10-14", 
      expectedDelivery: "2024-10-20", 
      receivedDate: null,
      items: 8
    },
    { 
      id: 4, 
      poNumber: "PO-2024-004", 
      supplier: "Tanga Dairy Products", 
      totalAmount: "680,000", 
      status: "Draft", 
      orderDate: "2024-10-15", 
      expectedDelivery: "2024-10-22", 
      receivedDate: null,
      items: 4
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Received":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "Partially Received":
        return <Clock className="h-3 w-3 mr-1" />;
      case "Submitted":
        return <FileText className="h-3 w-3 mr-1" />;
      case "Draft":
        return <Edit className="h-3 w-3 mr-1" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-success text-white";
      case "Partially Received":
        return "bg-orange-500 text-white";
      case "Submitted":
        return "bg-blue-500 text-white";
      case "Draft":
        return "bg-gray-500 text-white";
      case "Cancelled":
        return "bg-danger text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Purchase Orders</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search purchase orders..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-32 text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Status</SelectItem>
                    <SelectItem value="draft" className="text-xs">Draft</SelectItem>
                    <SelectItem value="submitted" className="text-xs">Submitted</SelectItem>
                    <SelectItem value="received" className="text-xs">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Create PO
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-semibold">Create Purchase Order</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="supplier" className="text-xs text-gray-600">Supplier</Label>
                        <Select>
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coca-cola" className="text-xs">Coca Cola Kwanza Ltd</SelectItem>
                            <SelectItem value="bakery" className="text-xs">Tanzania Bakery Supply</SelectItem>
                            <SelectItem value="grains" className="text-xs">East Africa Grains</SelectItem>
                            <SelectItem value="dairy" className="text-xs">Tanga Dairy Products</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="orderDate" className="text-xs text-gray-600">Order Date</Label>
                        <Input id="orderDate" type="date" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expectedDelivery" className="text-xs text-gray-600">Expected Delivery</Label>
                        <Input id="expectedDelivery" type="date" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="notes" className="text-xs text-gray-600">Notes</Label>
                        <Input id="notes" placeholder="Additional notes..." className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded p-3">
                      <h4 className="text-xs font-medium text-foreground mb-3">Add Items</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-6 gap-2">
                          <div className="col-span-2">
                            <Select>
                              <SelectTrigger className="h-8 text-xs border-gray-200">
                                <SelectValue placeholder="Product" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="coca-cola" className="text-xs">Coca Cola 500ml</SelectItem>
                                <SelectItem value="bread" className="text-xs">Bread Loaf</SelectItem>
                                <SelectItem value="rice" className="text-xs">Rice 1kg</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Input placeholder="Qty" className="h-8 text-xs border-gray-200" />
                          </div>
                          <div>
                            <Select>
                              <SelectTrigger className="h-8 text-xs border-gray-200">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pack" className="text-xs">Pack</SelectItem>
                                <SelectItem value="unit" className="text-xs">Unit</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Input placeholder="Price" className="h-8 text-xs border-gray-200" />
                          </div>
                          <div>
                            <Button size="sm" className="h-8 text-xs">Add</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                      <Button className="h-8 text-xs">Create PO</Button>
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
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">PO Number</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Supplier</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Total Amount</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Order Date</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Expected Delivery</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Items</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map((po) => (
                      <tr key={po.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{po.poNumber}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{po.supplier}</td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">{po.totalAmount} TZS</td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className={`text-xs ${getStatusColor(po.status)}`}>
                            {getStatusIcon(po.status)}
                            {po.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{po.orderDate}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{po.expectedDelivery}</td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">{po.items}</td>
                        <td className="px-4 py-3 text-xs text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xs font-semibold">Purchase Order Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="text-gray-600">PO Number:</span>
                                      <div className="font-medium">{po.poNumber}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Supplier:</span>
                                      <div className="font-medium">{po.supplier}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Total Amount:</span>
                                      <div className="font-medium">{po.totalAmount} TZS</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Status:</span>
                                      <div className="font-medium">{po.status}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Order Date:</span>
                                      <div className="font-medium">{po.orderDate}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Expected Delivery:</span>
                                      <div className="font-medium">{po.expectedDelivery}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="border border-gray-200 rounded p-3">
                                    <h4 className="text-xs font-medium text-foreground mb-2">Items</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-xs">
                                        <span>Coca Cola 500ml - 10 packs</span>
                                        <span>800,000 TZS</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span>Bread Loaf - 50 units</span>
                                        <span>400,000 TZS</span>
                                      </div>
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
                                  <DialogTitle className="text-xs font-semibold">Edit Purchase Order</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-supplier" className="text-xs text-gray-600">Supplier</Label>
                                      <Select defaultValue="coca-cola">
                                        <SelectTrigger className="h-8 text-xs border-gray-200">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="coca-cola" className="text-xs">Coca Cola Kwanza Ltd</SelectItem>
                                          <SelectItem value="bakery" className="text-xs">Tanzania Bakery Supply</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-status" className="text-xs text-gray-600">Status</Label>
                                      <Select defaultValue={po.status.toLowerCase().replace(' ', '_')}>
                                        <SelectTrigger className="h-8 text-xs border-gray-200">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="draft" className="text-xs">Draft</SelectItem>
                                          <SelectItem value="submitted" className="text-xs">Submitted</SelectItem>
                                          <SelectItem value="partially_received" className="text-xs">Partially Received</SelectItem>
                                          <SelectItem value="received" className="text-xs">Received</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button className="h-8 text-xs">Update PO</Button>
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
                                  <DialogTitle className="text-xs font-semibold">Delete Purchase Order</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to delete <strong>{po.poNumber}</strong>? This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button variant="destructive" className="h-8 text-xs">Delete PO</Button>
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
