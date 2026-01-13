import React, { type PropsWithChildren } from "react";
import AppHeader from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { SidebarProvider as UISidebarProvider } from "../../components/ui/sidebar";
import { Toaster } from "sonner";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}

function AdminLayout({ children, breadcrumbItems }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <UISidebarProvider>
        <AdminLayoutContent breadcrumbItems={breadcrumbItems}>{children}</AdminLayoutContent>
      </UISidebarProvider>
    </SidebarProvider>
  );
}

const AdminLayoutContent: React.FC<PropsWithChildren<{ breadcrumbItems?: BreadcrumbItem[] }>> = ({
  children,
}) => {
  const { isMobileOpen } = useSidebar();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar is positioned static on lg screens, so it takes up space in the layout */}
      <AppSidebar />

      {/* Mobile backdrop */}
      {isMobileOpen && <div className="fixed inset-0 z-10 bg-gray-900/60 backdrop-blur-sm lg:hidden" />}

      {/* Main content area - don't need margin since sidebar takes up space */}
      <div className="flex-1 flex flex-col overflow-hidden border-l border-gray-200 dark:border-gray-800">
        <AppHeader />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 md:p-6">{children}</div>
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default AdminLayout;
