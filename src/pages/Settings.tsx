import { Save, Key, DollarSign, Users, Bell } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Settings</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="border-gray-200">
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                <TabsTrigger value="payment" className="text-xs">Payment Gateway</TabsTrigger>
                <TabsTrigger value="tariff" className="text-xs">Tariffs & Fees</TabsTrigger>
                <TabsTrigger value="users" className="text-xs">User Management</TabsTrigger>
                <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card className="p-4 border-gray-200">
                  <h3 className="text-xs font-semibold text-foreground mb-4">Store Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Store Name</Label>
                      <Input className="h-8 text-xs border-gray-200 mt-1" defaultValue="MonRize Store" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Store Address</Label>
                      <Input className="h-8 text-xs border-gray-200 mt-1" defaultValue="123 Main Street, Dar es Salaam" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">Phone Number</Label>
                        <Input className="h-8 text-xs border-gray-200 mt-1" defaultValue="+255 714 123 456" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Email</Label>
                        <Input className="h-8 text-xs border-gray-200 mt-1" defaultValue="info@monrize.co.tz" />
                      </div>
                    </div>
                    <Button size="sm" className="h-8 text-xs">
                      <Save className="h-3 w-3 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card className="p-4 border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="h-4 w-4 text-gray-600" />
                    <h3 className="text-xs font-semibold text-foreground">API Key Management</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 border border-gray-200 rounded">
                      <h4 className="text-xs font-medium text-foreground mb-2">Outbound Keys (Our System → Gateway)</h4>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-gray-600">API Key</Label>
                          <Input className="h-8 text-xs border-gray-200 mt-1" type="password" defaultValue="pk_live_xxxxxxxxxxxxx" />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Secret Key</Label>
                          <Input className="h-8 text-xs border-gray-200 mt-1" type="password" defaultValue="sk_live_xxxxxxxxxxxxx" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded">
                      <h4 className="text-xs font-medium text-foreground mb-2">Inbound Keys (Gateway → Our System)</h4>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-gray-600">Webhook API Key</Label>
                          <Input className="h-8 text-xs border-gray-200 mt-1" readOnly defaultValue="wh_xxxxxxxxxxxxx" />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Webhook Secret</Label>
                          <Input className="h-8 text-xs border-gray-200 mt-1" readOnly defaultValue="whsec_xxxxxxxxxxxxx" />
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 text-xs">
                      <Save className="h-3 w-3 mr-1" />
                      Update Keys
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="tariff">
                <Card className="p-4 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      <h3 className="text-xs font-semibold text-foreground">Tariff Configuration</h3>
                    </div>
                    <Button size="sm" className="h-8 text-xs">Add Tariff</Button>
                  </div>
                  
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="text-xs font-medium text-foreground mb-2">Tariff Calculation Example</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>Product cost: <span className="font-medium text-foreground">2,000 TZS</span></div>
                      <div>Applicable tariff range: <span className="font-medium text-foreground">0 - 3,000</span></div>
                      <div>Tariff fee: <span className="font-medium text-foreground">700 TZS</span></div>
                      <div className="pt-1 border-t border-blue-200">
                        Total payment: <span className="font-semibold text-foreground">2,700 TZS</span> (2,000 + 700)
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Type</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Min Value (TZS)</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Max Value (TZS)</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Fee (TZS)</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Status</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Effective Date</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="px-3 py-2 text-xs text-gray-600">Collection</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">0</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">3,000</td>
                          <td className="px-3 py-2 text-xs text-foreground text-right font-medium">700</td>
                          <td className="px-3 py-2 text-xs">
                            <Badge className="bg-success text-white text-xs">Active</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">2025-01-01</td>
                          <td className="px-3 py-2 text-xs text-right">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-3 py-2 text-xs text-gray-600">Collection</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">3,001</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">10,000</td>
                          <td className="px-3 py-2 text-xs text-foreground text-right font-medium">1,200</td>
                          <td className="px-3 py-2 text-xs">
                            <Badge className="bg-success text-white text-xs">Active</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">2025-01-01</td>
                          <td className="px-3 py-2 text-xs text-right">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-3 py-2 text-xs text-gray-600">Collection</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">10,001</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">50,000</td>
                          <td className="px-3 py-2 text-xs text-foreground text-right font-medium">2,500</td>
                          <td className="px-3 py-2 text-xs">
                            <Badge className="bg-success text-white text-xs">Active</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">2025-01-01</td>
                          <td className="px-3 py-2 text-xs text-right">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-3 py-2 text-xs text-gray-600">Disbursement</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">0</td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-right">10,000</td>
                          <td className="px-3 py-2 text-xs text-foreground text-right font-medium">500</td>
                          <td className="px-3 py-2 text-xs">
                            <Badge className="bg-success text-white text-xs">Active</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">2025-01-01</td>
                          <td className="px-3 py-2 text-xs text-right">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="p-4 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <h3 className="text-xs font-semibold text-foreground">User Management</h3>
                    </div>
                    <Button size="sm" className="h-8 text-xs">Add User</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Name</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Email</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Role</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Status</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="px-3 py-2 text-xs text-foreground font-medium">Admin User</td>
                          <td className="px-3 py-2 text-xs text-gray-600">admin@monrize.co.tz</td>
                          <td className="px-3 py-2 text-xs text-gray-600">Super Admin</td>
                          <td className="px-3 py-2 text-xs text-success">Active</td>
                          <td className="px-3 py-2 text-xs text-right">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="p-4 border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="h-4 w-4 text-gray-600" />
                    <h3 className="text-xs font-semibold text-foreground">Notification Preferences</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                      <div>
                        <div className="text-xs font-medium text-foreground">Low Stock Alerts</div>
                        <div className="text-xs text-gray-600">Get notified when products are running low</div>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                      <div>
                        <div className="text-xs font-medium text-foreground">Payment Notifications</div>
                        <div className="text-xs text-gray-600">Receive alerts for all payment transactions</div>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                      <div>
                        <div className="text-xs font-medium text-foreground">Daily Reports</div>
                        <div className="text-xs text-gray-600">Get daily summary reports via email</div>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
