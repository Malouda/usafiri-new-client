import { Home, Package, Warehouse, ShoppingCart, Receipt, Users, CreditCard, BarChart3, Settings, Wifi, FolderOpen, FileText, Key, Calculator, Smartphone, Bell, Building2, Store, Bus, UserCircle2, Factory, Car, Route, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "./SidebarContext";
import { UserRole } from "@/modules/shared/interfaces";
import { useAppSelector } from "@/store";

const items = [
  { title: "Dashboard", url: "/", icon: Home, roles: [] },
  { title: "Trips", url: "/trips", icon: Bus, roles: [] },
  { title: "Routes", url: "/routes", icon: Route, roles: [] },
  { title: "Stops", url: "/stops", icon: MapPin, roles: [] },
  { title: "Buses", url: "/fleet/buses", icon: Bus, roles: [] },
  { title: "Drivers", url: "/fleet/drivers", icon: UserCircle2, roles: [] },
  { title: "Makes", url: "/fleet/makes", icon: Factory, roles: [] },
  { title: "Models", url: "/fleet/models", icon: Car, roles: [] },
  { title: "My Businesses", url: "/business/my-businesses", icon: Store, roles: ["super_admin", "store_owner"] },
  { title: "Products", url: "/products", icon: Package, roles: [] },
  { title: "Categories", url: "/categories", icon: FolderOpen, roles: [] },
  { title: "Inventory", url: "/inventory", icon: Warehouse, roles: [] },
  { title: "POS", url: "/pos", icon: ShoppingCart, roles: [] },
  { title: "Sales", url: "/sales", icon: Receipt, roles: [] },
  { title: "Customers", url: "/customers", icon: Users, roles: [] },
  { title: "Suppliers", url: "/suppliers", icon: Building2, roles: [] },
  { title: "Purchase Orders", url: "/purchase-orders", icon: FileText, roles: [] },
  { title: "Payments", url: "/payments", icon: CreditCard, roles: [] },
  { title: "Reports", url: "/reports", icon: BarChart3, roles: [] },
  { title: "Users", url: "/users", icon: Users, roles: [] },
  { title: "API Keys", url: "/api-keys", icon: Key, roles: [] },
  { title: "Tariffs", url: "/tariffs", icon: Calculator, roles: [] },
  { title: "Phone Networks", url: "/phone-networks", icon: Smartphone, roles: [] },
  { title: "Notifications", url: "/notifications", icon: Bell, roles: [] },
  { title: "Network Config", url: "/network-config", icon: Wifi, roles: [] },
  { title: "Settings", url: "/settings", icon: Settings, roles: [] },
];

export function AppSidebar() {
  const { isExpanded, isMobileOpen } = useSidebar();
  const isCollapsed = !isExpanded;

  // Get user from Redux store to filter menu items
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;

  // Filter items based on user role
  const visibleItems = items.filter(item => {
    // If no roles specified, show to everyone
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    // Otherwise check if user's role is in the allowed roles
    return item.roles.includes(userRole);
  });

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-56"} h-full border-r transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            {!isCollapsed && <span className="font-bold text-primary">MonRize</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-xs ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
