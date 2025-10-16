import { AppSidebar } from "@/components/AppSidebar";
import { MetricCard } from "@/components/MetricCard";
import { TransactionChart } from "@/components/TransactionChart";
import { RevenueChart } from "@/components/RevenueChart";
import { TopMerchants } from "@/components/TopMerchants";
import { CurrentBalance } from "@/components/CurrentBalance";
import { PlannedPayouts } from "@/components/PlannedPayouts";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Plus, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-foreground">Merchants</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search" 
                  className="pl-9 w-64 h-9 text-xs bg-background"
                />
              </div>
              <Button size="icon" variant="ghost" className="h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                <User className="h-4 w-4" />
              </Button>
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
