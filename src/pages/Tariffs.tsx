import { Plus, Search, Edit, Trash2, Eye, Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tariffs() {
  const tariffs = [
    { 
      id: 1, 
      type: "Collection", 
      minValue: "0", 
      maxValue: "1000", 
      fee: "50", 
      status: "Active", 
      effectiveDate: "2024-01-01",
      endDate: null
    },
    { 
      id: 2, 
      type: "Collection", 
      minValue: "1001", 
      maxValue: "10000", 
      fee: "100", 
      status: "Active", 
      effectiveDate: "2024-01-01",
      endDate: null
    },
    { 
      id: 3, 
      type: "Collection", 
      minValue: "10001", 
      maxValue: "100000", 
      fee: "200", 
      status: "Active", 
      effectiveDate: "2024-01-01",
      endDate: null
    },
    { 
      id: 4, 
      type: "Disbursement", 
      minValue: "0", 
      maxValue: "1000", 
      fee: "25", 
      status: "Active", 
      effectiveDate: "2024-01-01",
      endDate: null
    },
    { 
      id: 5, 
      type: "Disbursement", 
      minValue: "1001", 
      maxValue: "10000", 
      fee: "50", 
      status: "Active", 
      effectiveDate: "2024-01-01",
      endDate: null
    },
    { 
      id: 6, 
      type: "Collection", 
      minValue: "100001", 
      maxValue: "1000000", 
      fee: "500", 
      status: "Inactive", 
      effectiveDate: "2024-01-01",
      endDate: "2024-12-31"
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Collection":
        return <TrendingUp className="h-3 w-3 mr-1" />;
      case "Disbursement":
        return <TrendingDown className="h-3 w-3 mr-1" />;
      default:
        return <Calculator className="h-3 w-3 mr-1" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Collection":
        return "bg-green-500 text-white";
      case "Disbursement":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-white";
      case "Inactive":
        return "bg-gray-500 text-white";
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
              <h1 className="text-xs font-semibold text-foreground">Tariffs Management</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h3 className="text-xs font-medium text-foreground mb-2">Tariff Configuration</h3>
              <p className="text-xs text-gray-600">
                Configure fee structures for different payment types. Collection fees are charged when receiving payments, 
                while disbursement fees are charged when sending payments.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search tariffs..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-32 text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Types</SelectItem>
                    <SelectItem value="collection" className="text-xs">Collection</SelectItem>
                    <SelectItem value="disbursement" className="text-xs">Disbursement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tariff
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-semibold">Add New Tariff</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type" className="text-xs text-gray-600">Tariff Type</Label>
                      <Select>
                        <SelectTrigger className="h-8 text-xs border-gray-200">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collection" className="text-xs">Collection</SelectItem>
                          <SelectItem value="disbursement" className="text-xs">Disbursement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minValue" className="text-xs text-gray-600">Min Value (TZS)</Label>
                        <Input id="minValue" placeholder="0" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="maxValue" className="text-xs text-gray-600">Max Value (TZS)</Label>
                        <Input id="maxValue" placeholder="1000" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fee" className="text-xs text-gray-600">Fee (TZS)</Label>
                      <Input id="fee" placeholder="50" className="h-8 text-xs border-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="effectiveDate" className="text-xs text-gray-600">Effective Date</Label>
                        <Input id="effectiveDate" type="date" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="endDate" className="text-xs text-gray-600">End Date (Optional)</Label>
                        <Input id="endDate" type="date" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                      <Button className="h-8 text-xs">Add Tariff</Button>
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
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Type</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Min Value</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Max Value</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Fee</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Effective Date</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">End Date</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffs.map((tariff) => (
                      <tr key={tariff.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs">
                          <Badge className={`text-xs ${getTypeColor(tariff.type)}`}>
                            {getTypeIcon(tariff.type)}
                            {tariff.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">
                          {parseInt(tariff.minValue).toLocaleString()} TZS
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">
                          {parseInt(tariff.maxValue).toLocaleString()} TZS
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground text-right font-medium">
                          {parseInt(tariff.fee).toLocaleString()} TZS
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className={`text-xs ${getStatusColor(tariff.status)}`}>
                            {tariff.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{tariff.effectiveDate}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{tariff.endDate || "-"}</td>
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
                                  <DialogTitle className="text-xs font-semibold">Tariff Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="text-gray-600">Type:</span>
                                      <div className="font-medium">{tariff.type}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Status:</span>
                                      <div className="font-medium">{tariff.status}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Min Value:</span>
                                      <div className="font-medium">{parseInt(tariff.minValue).toLocaleString()} TZS</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Max Value:</span>
                                      <div className="font-medium">{parseInt(tariff.maxValue).toLocaleString()} TZS</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Fee:</span>
                                      <div className="font-medium">{parseInt(tariff.fee).toLocaleString()} TZS</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Effective Date:</span>
                                      <div className="font-medium">{tariff.effectiveDate}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">End Date:</span>
                                      <div className="font-medium">{tariff.endDate || "No end date"}</div>
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
                                  <DialogTitle className="text-xs font-semibold">Edit Tariff</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-type" className="text-xs text-gray-600">Tariff Type</Label>
                                    <Select defaultValue={tariff.type.toLowerCase()}>
                                      <SelectTrigger className="h-8 text-xs border-gray-200">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="collection" className="text-xs">Collection</SelectItem>
                                        <SelectItem value="disbursement" className="text-xs">Disbursement</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-minValue" className="text-xs text-gray-600">Min Value (TZS)</Label>
                                      <Input id="edit-minValue" defaultValue={tariff.minValue} className="h-8 text-xs border-gray-200" />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-maxValue" className="text-xs text-gray-600">Max Value (TZS)</Label>
                                      <Input id="edit-maxValue" defaultValue={tariff.maxValue} className="h-8 text-xs border-gray-200" />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-fee" className="text-xs text-gray-600">Fee (TZS)</Label>
                                    <Input id="edit-fee" defaultValue={tariff.fee} className="h-8 text-xs border-gray-200" />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button className="h-8 text-xs">Update Tariff</Button>
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
                                  <DialogTitle className="text-xs font-semibold">Delete Tariff</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to delete this tariff? This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button variant="destructive" className="h-8 text-xs">Delete Tariff</Button>
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
