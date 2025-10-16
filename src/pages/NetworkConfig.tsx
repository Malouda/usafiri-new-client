import { Plus, Search, Edit, Trash2, Eye, Wifi, WifiOff } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function NetworkConfig() {
  const networks = [
    { id: 1, country: "Tanzania", prefix: "+255 714, +255 754, +255 764, +255 784", operator: "Vodacom", service: "M-Pesa", type: "Mobile Money", status: "Active" },
    { id: 2, country: "Tanzania", prefix: "+255 715, +255 755, +255 765, +255 785", operator: "Vodacom", service: "Voice/SMS", type: "Mobile Network", status: "Active" },
    { id: 3, country: "Tanzania", prefix: "+255 681, +255 682, +255 683, +255 684, +255 685, +255 686, +255 687, +255 688, +255 689", operator: "Airtel", service: "Airtel Money", type: "Mobile Money", status: "Active" },
    { id: 4, country: "Tanzania", prefix: "+255 710, +255 740, +255 750", operator: "Airtel", service: "Voice/SMS", type: "Mobile Network", status: "Active" },
    { id: 5, country: "Tanzania", prefix: "+255 713, +255 753, +255 763", operator: "Tigo", service: "Tigo Pesa", type: "Mobile Money", status: "Active" },
    { id: 6, country: "Tanzania", prefix: "+255 711, +255 741, +255 751", operator: "Tigo", service: "Voice/SMS", type: "Mobile Network", status: "Active" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Network Configuration</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="p-4 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="h-4 w-4 text-success" />
                  <h3 className="text-xs font-medium text-foreground">Online Mode</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">System is connected to the internet</p>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-xs text-gray-600">Enable online mode</span>
                </div>
              </Card>
              
              <Card className="p-4 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <WifiOff className="h-4 w-4 text-orange-500" />
                  <h3 className="text-xs font-medium text-foreground">Offline Mode</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">Local operations only</p>
                <div className="flex items-center gap-2">
                  <Switch />
                  <span className="text-xs text-gray-600">Enable offline mode</span>
                </div>
              </Card>
              
              <Card className="p-4 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="h-4 w-4 text-gray-600" />
                  <h3 className="text-xs font-medium text-foreground">Sync Status</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">Last sync: 2 minutes ago</p>
                <Button size="sm" className="h-6 text-xs">Sync Now</Button>
              </Card>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h3 className="text-xs font-medium text-foreground mb-2">Phone Number Network Tracking</h3>
              <p className="text-xs text-gray-600">
                The system automatically detects mobile network operators based on phone number prefixes.
                This enables proper payment routing to M-Pesa, Airtel Money, or Tigo Pesa gateways.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search network prefixes..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
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
                    <DialogTitle className="text-xs font-semibold">Add Network Configuration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="country" className="text-xs text-gray-600">Country</Label>
                      <Select>
                        <SelectTrigger className="h-8 text-xs border-gray-200">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tanzania" className="text-xs">Tanzania</SelectItem>
                          <SelectItem value="kenya" className="text-xs">Kenya</SelectItem>
                          <SelectItem value="uganda" className="text-xs">Uganda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="operator" className="text-xs text-gray-600">Operator</Label>
                      <Input id="operator" placeholder="Vodacom" className="h-8 text-xs border-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service" className="text-xs text-gray-600">Service</Label>
                        <Input id="service" placeholder="M-Pesa" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-xs text-gray-600">Type</Label>
                        <Select>
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mobile-money" className="text-xs">Mobile Money</SelectItem>
                            <SelectItem value="mobile-network" className="text-xs">Mobile Network</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="prefixes" className="text-xs text-gray-600">Phone Prefixes</Label>
                      <Input id="prefixes" placeholder="+255 714, +255 754" className="h-8 text-xs border-gray-200" />
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
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Prefixes</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Operator</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Service</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Type</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {networks.map((network) => (
                      <tr key={network.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-600">{network.country}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">{network.prefix}</td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{network.operator}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{network.service}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <Badge variant="outline" className="text-xs border-gray-200">{network.type}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className="bg-success text-white text-xs">{network.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-danger hover:text-danger">
                              <Trash2 className="h-3 w-3" />
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
