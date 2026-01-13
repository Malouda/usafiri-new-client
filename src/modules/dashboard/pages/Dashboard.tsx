import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";

const Dashboard = () => {
  return (
    <div className="w-full">
      {/* Tabs */}
      <Tabs defaultValue="today" className="mb-4">
        <TabsList className="bg-transparent border-b border-gray-200 rounded-none h-auto p-0">
          <TabsTrigger
            value="today"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            This Week
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            This Month
          </TabsTrigger>
          <TabsTrigger
            value="year"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
          >
            This Year
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Dashboard;
