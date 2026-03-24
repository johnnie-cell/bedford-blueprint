import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboard, apiCall } from "@/lib/dashboardState";
import { TrendingUp, Zap } from "lucide-react";

export default function Pipeline() {
  const state = getDashboard();
  const open = state.pipeline.filter(d => d.status === "open");
  const closed = state.pipeline.filter(d => d.status === "closed");

  return (
    <div className="space-y-6 max-w-6xl">
      <h2 className="text-xl font-heading font-bold">Pipeline & Automations</h2>

      {/* Open Deals */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Open Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground text-xs">Deal</TableHead>
                <TableHead className="text-muted-foreground text-xs">Value</TableHead>
                <TableHead className="text-muted-foreground text-xs">Stage</TableHead>
                <TableHead className="text-muted-foreground text-xs">Next Step</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {open.map(d => (
                <TableRow key={d.id} className="border-border/20">
                  <TableCell className="text-sm font-medium">{d.name}</TableCell>
                  <TableCell className="text-sm text-accent">{d.value}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{d.stage}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.nextStep}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Closed Deals */}
      {closed.length > 0 && (
        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading text-muted-foreground">Closed Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/30">
                  <TableHead className="text-muted-foreground text-xs">Deal</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Value</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closed.map(d => (
                  <TableRow key={d.id} className="border-border/20">
                    <TableCell className="text-sm">{d.name}</TableCell>
                    <TableCell className="text-sm text-accent">{d.value}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] border-accent/30 text-accent">{d.stage}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Automations */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" /> Automations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.automations.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">Last run: {a.lastRun}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] ${a.status === "active" ? "border-primary/30 text-primary" : "border-muted-foreground/30 text-muted-foreground"}`}>
                    {a.status.toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-border h-7"
                    onClick={() => apiCall(`/api/actions/${a.name.toLowerCase().replace(/ /g, "-")}`)}
                  >
                    Run
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
