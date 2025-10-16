import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Sat 26", value: 5000, projected: 4500 },
  { name: "Sun 27", value: 7000, projected: 5500 },
  { name: "Mon 28", value: 6500, projected: 6000 },
  { name: "Tue 29", value: 10000, projected: 7000 },
  { name: "Wed 30", value: 11000, projected: 8000 },
  { name: "Thu 31", value: 8500, projected: 9500 },
  { name: "Fri 01", value: 13000, projected: 11000 },
];

export function TransactionChart() {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-normal text-muted-foreground mb-2">Total transactions</h3>
          <div className="text-2xl font-semibold text-foreground">€7,720.64</div>
        </div>
        <Select defaultValue="7">
          <SelectTrigger className="h-7 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `€${value / 1000}k`}
            />
            <Line 
              type="monotone" 
              dataKey="projected" 
              stroke="hsl(var(--border))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
