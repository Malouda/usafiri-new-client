import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function PlannedPayouts() {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-normal text-muted-foreground flex items-center gap-1">
          Planned Payouts
          <ExternalLink className="h-3 w-3" />
        </h3>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-semibold text-foreground mb-1">€56,98.00</div>
        <div className="text-xs text-muted-foreground">Total future payout planned</div>
      </div>
      
      <div className="space-y-3">
        <div className="text-xs font-medium text-muted-foreground">Payment Count</div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-8 bg-success rounded flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-card">Successed</span>
            </div>
          </div>
          <div className="flex-1 h-8 bg-danger rounded flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-danger rounded-full"></div>
              <span className="text-xs text-card">Failed</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">Successed</span>
          </div>
          <span className="text-xs font-semibold text-foreground">€194,65.00</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-danger rounded-full"></div>
            <span className="text-xs text-muted-foreground">Failed</span>
          </div>
          <span className="text-xs font-semibold text-foreground">€946.00</span>
        </div>
      </div>
    </Card>
  );
}
