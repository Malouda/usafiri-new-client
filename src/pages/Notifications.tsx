import { Bell, Search, Eye, Check, CheckCheck, AlertTriangle, Info, CreditCard, Package, ShoppingCart } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Notifications() {
  const notifications = [
    { 
      id: 1, 
      type: "low_stock", 
      title: "Low Stock Alert", 
      message: "Coca Cola 500ml is running low (5 units remaining)", 
      isRead: false, 
      createdAt: "2024-10-16 09:30",
      relatedEntity: "Product",
      relatedId: "prod_123"
    },
    { 
      id: 2, 
      type: "payment_received", 
      title: "Payment Received", 
      message: "Payment of 1,500 TZS received for Sale #SALE-2024-001", 
      isRead: false, 
      createdAt: "2024-10-16 08:45",
      relatedEntity: "Sale",
      relatedId: "sale_456"
    },
    { 
      id: 3, 
      type: "sale_completed", 
      title: "Sale Completed", 
      message: "Sale #SALE-2024-002 completed successfully", 
      isRead: true, 
      createdAt: "2024-10-15 17:20",
      relatedEntity: "Sale",
      relatedId: "sale_789"
    },
    { 
      id: 4, 
      type: "stock_addition", 
      title: "Stock Added", 
      message: "50 units of Bread Loaf added to inventory", 
      isRead: true, 
      createdAt: "2024-10-15 14:15",
      relatedEntity: "Product",
      relatedId: "prod_456"
    },
    { 
      id: 5, 
      type: "payment_failed", 
      title: "Payment Failed", 
      message: "Payment of 2,000 TZS failed for Sale #SALE-2024-003", 
      isRead: false, 
      createdAt: "2024-10-15 10:30",
      relatedEntity: "Sale",
      relatedId: "sale_101"
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "payment_received":
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case "sale_completed":
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case "stock_addition":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "payment_failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "low_stock":
        return "border-l-orange-500 bg-orange-50";
      case "payment_received":
        return "border-l-green-500 bg-green-50";
      case "sale_completed":
        return "border-l-blue-500 bg-blue-50";
      case "stock_addition":
        return "border-l-blue-500 bg-blue-50";
      case "payment_failed":
        return "border-l-red-500 bg-red-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                  <Input placeholder="Search notifications..." className="pl-7 h-8 text-xs border-gray-200" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200">
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200">
                  <Bell className="h-3 w-3 mr-1" />
                  Settings
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all" className="text-xs">All ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
                <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)} ${!notification.isRead ? 'border-gray-200' : ''}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-foreground">{notification.title}</h3>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Badge className="bg-red-500 text-white text-xs">New</Badge>
                              )}
                              <span className="text-xs text-gray-500">{notification.createdAt}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            {!notification.isRead && (
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3">
                {notifications.filter(n => !n.isRead).map((notification) => (
                  <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-foreground">{notification.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-red-500 text-white text-xs">New</Badge>
                              <span className="text-xs text-gray-500">{notification.createdAt}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="alerts" className="space-y-3">
                {notifications.filter(n => n.type === 'low_stock' || n.type === 'payment_failed').map((notification) => (
                  <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-foreground">{notification.title}</h3>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Badge className="bg-red-500 text-white text-xs">New</Badge>
                              )}
                              <span className="text-xs text-gray-500">{notification.createdAt}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            {!notification.isRead && (
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="payments" className="space-y-3">
                {notifications.filter(n => n.type === 'payment_received' || n.type === 'payment_failed' || n.type === 'sale_completed').map((notification) => (
                  <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-foreground">{notification.title}</h3>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Badge className="bg-red-500 text-white text-xs">New</Badge>
                              )}
                              <span className="text-xs text-gray-500">{notification.createdAt}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            {!notification.isRead && (
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
