import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getDashboard, updatePriority } from "@/lib/dashboardState";
import { useState } from "react";
import {
  Crosshair,
  Phone,
  DollarSign,
  Dumbbell,
  Mail,
  Flame,
} from "lucide-react";

function MetricChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2 bg-secondary/80 border border-border/50 rounded-md px-3 py-2">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-heading font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function Index() {
  const [state, setState] = useState(getDashboard);

  const togglePriority = (id: string) => {
    const p = state.topPriorities.find(p => p.id === id);
    if (p) {
      updatePriority(id, !p.done);
      setState(getDashboard());
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Banner */}
      <div className="rounded-lg bg-gradient-to-r from-secondary via-card to-secondary border border-border/50 p-6">
        <p className="text-xs text-muted-foreground font-mono mb-1">FRONTLINE BRIEFING</p>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
          Good morning, Johnnie.
        </h1>
        <p className="text-sm text-accent italic">"{state.quote}"</p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricChip icon={Crosshair} label="Leads Today" value={state.quickMetrics.leadsToday} />
        <MetricChip icon={Phone} label="Booked Calls" value={state.quickMetrics.bookedCalls} />
        <MetricChip icon={DollarSign} label="Revenue" value={state.quickMetrics.revenue} />
        <MetricChip icon={Dumbbell} label="Workouts" value={state.quickMetrics.workouts} />
        <MetricChip icon={Mail} label="Email Sends" value={state.quickMetrics.emailSends} />
      </div>

      {/* Top Priorities */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" />
            Top Priorities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {state.topPriorities.map((p) => (
              <div key={p.id} className="flex items-center gap-3 group">
                <Checkbox
                  checked={p.done}
                  onCheckedChange={() => togglePriority(p.id)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className={`text-sm ${p.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {p.text}
                </span>
                {!p.done && (
                  <Badge variant="outline" className="ml-auto text-[10px] border-accent/30 text-accent">
                    ACTIVE
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Utility */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30">
        <button
          onClick={() => { console.log("[API] /api/actions/sync-calendly"); }}
          className="text-xs px-3 py-1.5 rounded bg-secondary text-muted-foreground hover:text-accent hover:bg-secondary/80 border border-border/50 transition-colors"
        >
          Sync Calendly
        </button>
        <button
          onClick={() => { console.log("[API] /api/actions/run-reminders"); }}
          className="text-xs px-3 py-1.5 rounded bg-secondary text-muted-foreground hover:text-accent hover:bg-secondary/80 border border-border/50 transition-colors"
        >
          Run Reminders
        </button>
        <button
          onClick={() => { console.log("[API] /api/actions/send-foundation-offer"); }}
          className="text-xs px-3 py-1.5 rounded bg-secondary text-muted-foreground hover:text-accent hover:bg-secondary/80 border border-border/50 transition-colors"
        >
          Send 50% Offer
        </button>
      </div>
    </div>
  );
}
