import { Plus, Search, Edit, Trash2, Eye, User, Shield, UserCheck, UserX } from "lucide-react";
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

export default function Users() {
  const users = [
    { 
      id: 1, 
      username: "superadmin", 
      fullName: "Super Admin", 
      email: "superadmin@monrize.co.tz", 
      role: "Super Admin", 
      status: "Active", 
      lastLogin: "2024-10-16 09:30",
      phone: "+255 714 123 456"
    },
    { 
      id: 2, 
      username: "manager1", 
      fullName: "John Mwamba", 
      email: "john@monrize.co.tz", 
      role: "Manager", 
      status: "Active", 
      lastLogin: "2024-10-16 08:45",
      phone: "+255 765 789 012"
    },
    { 
      id: 3, 
      username: "cashier1", 
      fullName: "Mary Kimaro", 
      email: "mary@monrize.co.tz", 
      role: "Cashier", 
      status: "Active", 
      lastLogin: "2024-10-15 17:20",
      phone: "+255 713 456 789"
    },
    { 
      id: 4, 
      username: "seller1", 
      fullName: "Hassan Ali", 
      email: "hassan@monrize.co.tz", 
      role: "Seller", 
      status: "Inactive", 
      lastLogin: "2024-10-14 14:15",
      phone: "+255 784 234 567"
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Super Admin":
        return <Shield className="h-3 w-3 mr-1" />;
      case "Manager":
        return <UserCheck className="h-3 w-3 mr-1" />;
      case "Cashier":
        return <User className="h-3 w-3 mr-1" />;
      case "Seller":
        return <User className="h-3 w-3 mr-1" />;
      default:
        return <User className="h-3 w-3 mr-1" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-white";
      case "Inactive":
        return "bg-gray-500 text-white";
      case "Locked":
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
              <h1 className="text-xs font-semibold text-foreground">User Management</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search users..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-32 text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Roles</SelectItem>
                    <SelectItem value="super_admin" className="text-xs">Super Admin</SelectItem>
                    <SelectItem value="manager" className="text-xs">Manager</SelectItem>
                    <SelectItem value="cashier" className="text-xs">Cashier</SelectItem>
                    <SelectItem value="seller" className="text-xs">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-semibold">Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username" className="text-xs text-gray-600">Username</Label>
                        <Input id="username" placeholder="johndoe" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-xs text-gray-600">Email</Label>
                        <Input id="email" placeholder="john@monrize.co.tz" className="h-8 text-xs border-gray-200" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fullName" className="text-xs text-gray-600">Full Name</Label>
                      <Input id="fullName" placeholder="John Doe" className="h-8 text-xs border-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-xs text-gray-600">Phone</Label>
                        <Input id="phone" placeholder="+255 714 123 456" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="role" className="text-xs text-gray-600">Role</Label>
                        <Select>
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin" className="text-xs">Super Admin</SelectItem>
                            <SelectItem value="manager" className="text-xs">Manager</SelectItem>
                            <SelectItem value="cashier" className="text-xs">Cashier</SelectItem>
                            <SelectItem value="seller" className="text-xs">Seller</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password" className="text-xs text-gray-600">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" className="h-8 text-xs border-gray-200" />
                      </div>
                      <div>
                        <Label htmlFor="language" className="text-xs text-gray-600">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger className="h-8 text-xs border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en" className="text-xs">English</SelectItem>
                            <SelectItem value="sw" className="text-xs">Swahili</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                      <Button className="h-8 text-xs">Add User</Button>
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
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">User</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Contact</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Role</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-600">Last Login</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-foreground font-medium">
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-gray-600">@{user.username}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div>
                            <div>{user.email}</div>
                            <div className="text-gray-500">{user.phone}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <Badge variant="outline" className="text-xs border-gray-200">
                            {getRoleIcon(user.role)}
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{user.lastLogin}</td>
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
                                  <DialogTitle className="text-xs font-semibold">User Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{user.fullName}</div>
                                    <div className="text-xs text-gray-600">@{user.username}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="text-gray-600">Email:</span>
                                      <div className="font-medium">{user.email}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Phone:</span>
                                      <div className="font-medium">{user.phone}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Role:</span>
                                      <div className="font-medium">{user.role}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Status:</span>
                                      <div className="font-medium">{user.status}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Last Login:</span>
                                      <div className="font-medium">{user.lastLogin}</div>
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
                                  <DialogTitle className="text-xs font-semibold">Edit User</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-username" className="text-xs text-gray-600">Username</Label>
                                      <Input id="edit-username" defaultValue={user.username} className="h-8 text-xs border-gray-200" />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-email" className="text-xs text-gray-600">Email</Label>
                                      <Input id="edit-email" defaultValue={user.email} className="h-8 text-xs border-gray-200" />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-fullName" className="text-xs text-gray-600">Full Name</Label>
                                    <Input id="edit-fullName" defaultValue={user.fullName} className="h-8 text-xs border-gray-200" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-phone" className="text-xs text-gray-600">Phone</Label>
                                      <Input id="edit-phone" defaultValue={user.phone} className="h-8 text-xs border-gray-200" />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-role" className="text-xs text-gray-600">Role</Label>
                                      <Select defaultValue={user.role.toLowerCase().replace(' ', '_')}>
                                        <SelectTrigger className="h-8 text-xs border-gray-200">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="super_admin" className="text-xs">Super Admin</SelectItem>
                                          <SelectItem value="manager" className="text-xs">Manager</SelectItem>
                                          <SelectItem value="cashier" className="text-xs">Cashier</SelectItem>
                                          <SelectItem value="seller" className="text-xs">Seller</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button className="h-8 text-xs">Update User</Button>
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
                                  <DialogTitle className="text-xs font-semibold">Delete User</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-600">
                                    Are you sure you want to delete <strong>{user.fullName}</strong>? This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                                    <Button variant="destructive" className="h-8 text-xs">Delete User</Button>
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
