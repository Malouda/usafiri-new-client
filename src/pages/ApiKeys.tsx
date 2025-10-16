import { Plus, Search, Edit, Trash2, Eye, Key, RotateCcw, Copy, EyeOff } from "lucide-react";
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

export default function ApiKeys() {
  const apiKeys = [
    { 
      id: 1, 
      name: "M-Pesa Gateway", 
      keyType: "Outbound", 
      apiKey: "pk_live_xxxxxxxxxxxxx", 
      provider: "M-Pesa", 
      status: "Active", 
      expiryDate: "2025-12-31",
      lastUsed: "2024-10-16 09:30",
      createdAt: "2024-01-01"
    },
    { 
      id: 2, 
      name: "Webhook Receiver", 
      keyType: "Inbound", 
      apiKey: "wh_xxxxxxxxxxxxx", 
      provider: "M-Pesa", 
      status: "Active", 
      expiryDate: "2025-12-31",
      lastUsed: "2024-10-16 08:45",
      createdAt: "2024-01-01"
    },
    { 
      id: 3, 
      name: "Airtel Money Gateway", 
      keyType: "Outbound", 
      apiKey: "ak_live_xxxxxxxxxxxxx", 
      provider: "Airtel Money", 
      status: "Inactive", 
      expiryDate: "2024-12-31",
      lastUsed: "2024-10-15 17:20",
      createdAt: "2024-01-01"
    },
    { 
      id: 4, 
      name: "Tigo Pesa Gateway", 
      keyType: "Outbound", 
      apiKey: "tp_live_xxxxxxxxxxxxx", 
      provider: "Tigo Pesa", 
      status: "Active", 
      expiryDate: "2025-06-30",
      lastUsed: "2024-10-14 14:15",
      createdAt: "2024-01-01"
    },
  ];

  const getKeyTypeColor = (keyType: string) => {
    switch (keyType) {
      case "Outbound":
        return "bg-blue-500 text-white";
      case "Inbound":
        return "bg-green-500 text-white";
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
      case "Revoked":
        return "bg-danger text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + "•".repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">API Keys Management</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h3 className="text-xs font-medium text-foreground mb-2">API Key Security</h3>
              <p className="text-xs text-gray-600">
                API keys are encrypted and stored securely. Outbound keys are used to connect to external services, 
                while inbound keys are used by external services to connect to our system.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search API keys..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-32 text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Types</SelectItem>
                    <SelectItem value="outbound" className="text-xs">Outbound</SelectItem>
                    <SelectItem value="inbound" className="text-xs">Inbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add API Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-semibold">Add New API Key</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-xs text-gray-600">Key Name</Label>
                      <Input id="name" placeholder="M-Pesa Gateway" className="h-8 text-xs border-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="keyType" className="text-xs text-gray-600">Key Type</Label>
                        <Select>
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outbound" className="text-xs">Outbound</SelectItem>
                            <SelectItem value="inbound" className="text-xs">Inbound</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="provider" className="text-xs text-gray-600">Provider</Label>
                        <Input id="provider" placeholder="M-Pesa" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="apiKey" className="text-xs text-gray-600">API Key</Label>
                        <Input id="apiKey" placeholder="pk_live_xxxxxxxxxxxxx" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="secretKey" className="text-xs text-gray-600">Secret Key</Label>
                        <Input id="secretKey" type="password" placeholder="sk_live_xxxxxxxxxxxxx" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="expiryDate" className="text-xs text-gray-600">Expiry Date</Label>
                      <Input id="expiryDate" type="date" className="h-8 text-xs border-gray-200" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                      <Button className="h-8 text-xs">Add API Key</Button>
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
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Name</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Type</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">API Key</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Provider</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Expiry</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-foreground font-medium">{key.name}</td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className={`text-xs ${getKeyTypeColor(key.keyType)}`}>
                            {key.keyType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                          <div className="flex items-center gap-2">
                            <span>{maskApiKey(key.apiKey)}</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{key.provider}</td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className={`text-xs ${getStatusColor(key.status)}`}>
                            {key.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{key.expiryDate}</td>
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
                                  <DialogTitle className="text-xs font-semibold">API Key Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{key.name}</div>
                                    <div className="text-xs text-gray-600">{key.provider}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="text-gray-600">Type:</span>
                                      <div className="font-medium">{key.keyType}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Status:</span>
                                      <div className="font-medium">{key.status}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">API Key:</span>
                                      <div className="font-mono text-xs bg-gray-100 p-1 rounded">{key.apiKey}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Expiry:</span>
                                      <div className="font-medium">{key.expiryDate}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Last Used:</span>
                                      <div className="font-medium">{key.lastUsed}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Created:</span>
                                      <div className="font-medium">{key.createdAt}</div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-xs font-semibold">Rotate API Key</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to rotate the API key for <strong>{key.name}</strong>? 
                                    This will generate a new key and invalidate the current one.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button className="h-8 text-xs">Rotate Key</Button>
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
                                  <DialogTitle className="text-xs font-semibold">Revoke API Key</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to revoke <strong>{key.name}</strong>? 
                                    This action cannot be undone and will immediately invalidate the key.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button variant="destructive" className="h-8 text-xs">Revoke Key</Button>
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
