import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const balances = [
  { currency: "USD", amount: "$10,180.00" },
  { currency: "RUB", amount: "₽33,180.00" },
  { currency: "UAH", amount: "₴98,110.00" },
  { currency: "EUR", amount: "€59,609.00" },
  { currency: "GBP", amount: "£15,043.00" },
];

export function CurrentBalance() {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal text-muted-foreground flex items-center gap-1">
          Current Balance
          <ExternalLink className="h-3 w-3" />
        </h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
          <span>Currency</span>
          <span>Amount</span>
        </div>
        {balances.map((balance) => (
          <div key={balance.currency} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{balance.currency}</span>
            <span className="text-xs font-semibold text-foreground">{balance.amount}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
