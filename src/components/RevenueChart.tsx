import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Sat 26", value: 3000 },
  { name: "Sun 27", value: 5000 },
  { name: "Mon 28", value: 15000, highlight: true, tooltip: "Jun 28 - 2024\n€15K" },
  { name: "Tue 29", value: 4000 },
  { name: "Wed 30", value: 6000 },
  { name: "Thu 31", value: 7000 },
  { name: "Fri 01", value: 5500 },
];

export function RevenueChart() {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-normal text-muted-foreground mb-2">Revenue growth</h3>
          <div className="text-2xl font-semibold text-foreground">€12,220.64</div>
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
          <BarChart data={data}>
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.highlight ? "hsl(var(--success))" : "hsl(var(--muted))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
