import { AppSidebar } from "@/components/AppSidebar";
import { MetricCard } from "@/components/MetricCard";
import { TransactionChart } from "@/components/TransactionChart";
import { RevenueChart } from "@/components/RevenueChart";
import { TopMerchants } from "@/components/TopMerchants";
import { CurrentBalance } from "@/components/CurrentBalance";
import { PlannedPayouts } from "@/components/PlannedPayouts";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                <Input placeholder="Search..." className="pl-7 h-8 text-xs border-gray-200" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="en">
                <SelectTrigger className="h-8 w-24 text-xs border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="text-xs">English</SelectItem>
                  <SelectItem value="sw" className="text-xs">Swahili</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger text-white text-xs rounded-full flex items-center justify-center">3</span>
              </Button>
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  A
                </div>
                <span className="text-xs text-gray-600">Admin User</span>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="merchants" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
                >
                  Merchants
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger 
                  value="finances" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
                >
                  Finances
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard 
                title="Revenue Growth"
                value="€12,220.64"
                change="+22.2%"
                isPositive={true}
              />
              <MetricCard 
                title="Rolling Balance"
                value="€52,340.64"
                change="+22.2%"
                isPositive={true}
              />
              <MetricCard 
                title="Fees Earned"
                value="€13,000.0"
                change="-12.2%"
                isPositive={false}
              />
              <MetricCard 
                title="Chargeback Rate"
                value="€27,650.00"
                change="+22.2%"
                isPositive={true}
              />
            </div>
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <TransactionChart />
              <RevenueChart />
            </div>
            
            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <PlannedPayouts />
              <TopMerchants />
              <CurrentBalance />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
