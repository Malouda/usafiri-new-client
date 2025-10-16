import { Plus, Search, Edit, Trash2, Eye, Smartphone, Globe, Wifi } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PhoneNetworks() {
  const phoneNetworks = [
    { 
      id: 1, 
      countryCode: "+255", 
      prefix: "074", 
      networkOperator: "Vodacom", 
      networkType: "GSM", 
      status: "Active",
      prefixes: ["074", "075", "076"]
    },
    { 
      id: 2, 
      countryCode: "+255", 
      prefix: "068", 
      networkOperator: "Airtel", 
      networkType: "GSM", 
      status: "Active",
      prefixes: ["068", "069"]
    },
    { 
      id: 3, 
      countryCode: "+255", 
      prefix: "071", 
      networkOperator: "Tigo", 
      networkType: "GSM", 
      status: "Active",
      prefixes: ["071", "072"]
    },
    { 
      id: 4, 
      countryCode: "+255", 
      prefix: "062", 
      networkOperator: "Halotel", 
      networkType: "GSM", 
      status: "Active",
      prefixes: ["062", "063"]
    },
    { 
      id: 5, 
      countryCode: "+255", 
      prefix: "073", 
      networkOperator: "TTCL", 
      networkType: "GSM", 
      status: "Inactive",
      prefixes: ["073"]
    },
  ];

  const getNetworkIcon = (networkType: string) => {
    switch (networkType) {
      case "GSM":
        return <Smartphone className="h-3 w-3 mr-1" />;
      case "CDMA":
        return <Wifi className="h-3 w-3 mr-1" />;
      default:
        return <Globe className="h-3 w-3 mr-1" />;
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
              <h1 className="text-xs font-semibold text-foreground">Phone Networks Management</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h3 className="text-xs font-medium text-foreground mb-2">Network Detection</h3>
              <p className="text-xs text-gray-600">
                Configure phone number prefixes for automatic network detection during mobile money payments. 
                This helps route payments to the correct gateway and calculate appropriate tariffs.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search networks..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-32 text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Networks</SelectItem>
                    <SelectItem value="vodacom" className="text-xs">Vodacom</SelectItem>
                    <SelectItem value="airtel" className="text-xs">Airtel</SelectItem>
                    <SelectItem value="tigo" className="text-xs">Tigo</SelectItem>
                    <SelectItem value="halotel" className="text-xs">Halotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Network
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-semibold">Add New Network</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="countryCode" className="text-xs text-gray-600">Country Code</Label>
                        <Input id="countryCode" placeholder="+255" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="prefix" className="text-xs text-gray-600">Prefix</Label>
                        <Input id="prefix" placeholder="074" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="networkOperator" className="text-xs text-gray-600">Network Operator</Label>
                        <Input id="networkOperator" placeholder="Vodacom" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="networkType" className="text-xs text-gray-600">Network Type</Label>
                        <Select>
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GSM" className="text-xs">GSM</SelectItem>
                            <SelectItem value="CDMA" className="text-xs">CDMA</SelectItem>
                            <SelectItem value="LTE" className="text-xs">LTE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="prefixes" className="text-xs text-gray-600">All Prefixes (comma separated)</Label>
                      <Input id="prefixes" placeholder="074,075,076" className="h-8 text-xs border-gray-200" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                      <Button className="h-8 text-xs">Add Network</Button>
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
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Country</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Prefix</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Operator</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Type</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">All Prefixes</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phoneNetworks.map((network) => (
                      <tr key={network.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{network.countryCode}</td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{network.prefix}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{network.networkOperator}</td>
                        <td className="px-4 py-3 text-xs">
                          <Badge variant="outline" className="text-xs border-gray-200">
                            {getNetworkIcon(network.networkType)}
                            {network.networkType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div className="flex flex-wrap gap-1">
                            {network.prefixes.map((prefix, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {prefix}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className={`text-xs ${getStatusColor(network.status)}`}>
                            {network.status}
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
                                  <DialogTitle className="text-xs font-semibold">Network Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{network.networkOperator}</div>
                                    <div className="text-xs text-gray-600">{network.countryCode} {network.prefix}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="text-gray-600">Country Code:</span>
                                      <div className="font-medium">{network.countryCode}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Primary Prefix:</span>
                                      <div className="font-medium">{network.prefix}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Network Type:</span>
                                      <div className="font-medium">{network.networkType}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Status:</span>
                                      <div className="font-medium">{network.status}</div>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-600">All Prefixes:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {network.prefixes.map((prefix, index) => (
                                          <Badge key={index} variant="secondary" className="text-xs">
                                            {prefix}
                                          </Badge>
                                        ))}
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
                                  <DialogTitle className="text-xs font-semibold">Edit Network</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-countryCode" className="text-xs text-gray-600">Country Code</Label>
                                      <Input id="edit-countryCode" defaultValue={network.countryCode} className="h-8 text-xs border-gray-200" />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-prefix" className="text-xs text-gray-600">Prefix</Label>
                                      <Input id="edit-prefix" defaultValue={network.prefix} className="h-8 text-xs border-gray-200" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-networkOperator" className="text-xs text-gray-600">Network Operator</Label>
                                      <Input id="edit-networkOperator" defaultValue={network.networkOperator} className="h-8 text-xs border-gray-200" />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-networkType" className="text-xs text-gray-600">Network Type</Label>
                                      <Select defaultValue={network.networkType}>
                                        <SelectTrigger className="h-8 text-xs border-gray-200">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="GSM" className="text-xs">GSM</SelectItem>
                                          <SelectItem value="CDMA" className="text-xs">CDMA</SelectItem>
                                          <SelectItem value="LTE" className="text-xs">LTE</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-prefixes" className="text-xs text-gray-600">All Prefixes (comma separated)</Label>
                                    <Input id="edit-prefixes" defaultValue={network.prefixes.join(',')} className="h-8 text-xs border-gray-200" />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button className="h-8 text-xs">Update Network</Button>
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
                                  <DialogTitle className="text-xs font-semibold">Delete Network</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to delete <strong>{network.networkOperator}</strong> network? 
                                    This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button variant="destructive" className="h-8 text-xs">Delete Network</Button>
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
