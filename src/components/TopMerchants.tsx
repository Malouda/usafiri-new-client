import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";

const merchants = [
  { name: "Masum Parvej", email: "hello@masum.design", amount: "€430,871", initials: "MP" },
  { name: "Floyd Miles", email: "floyed@gmail.com", amount: "€361,253", initials: "FM" },
  { name: "Dianne Russell", email: "michael@example.com", amount: "€297,105", initials: "DR" },
  { name: "Ronald Richards", email: "tanyahill@example.com", amount: "€12,893", initials: "RR" },
];

export function TopMerchants() {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal text-muted-foreground flex items-center gap-1">
          Top Merchants by Payouts
          <ExternalLink className="h-3 w-3" />
        </h3>
      </div>
      
      <div className="space-y-3">
        {merchants.map((merchant) => (
          <div key={merchant.email} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-muted">{merchant.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs font-medium text-foreground">{merchant.name}</div>
                <div className="text-xs text-muted-foreground">{merchant.email}</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-foreground">{merchant.amount}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
