import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboard } from "@/lib/dashboardState";
import { Handshake, Heart } from "lucide-react";

export default function Sponsors() {
  const state = getDashboard();
  const { sponsors, foundation } = state;
  const emeraldPct = Math.round((foundation.emeraldCurrent / foundation.emeraldTarget) * 100);

  return (
    <div className="space-y-6 max-w-6xl">
      <h2 className="text-xl font-heading font-bold">Sponsors & Foundation</h2>

      {/* Sponsor Pipeline */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Handshake className="h-4 w-4 text-accent" /> Sponsor Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground text-xs">Brand</TableHead>
                <TableHead className="text-muted-foreground text-xs">Value</TableHead>
                <TableHead className="text-muted-foreground text-xs">Stage</TableHead>
                <TableHead className="text-muted-foreground text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sponsors.map(s => (
                <TableRow key={s.id} className="border-border/20">
                  <TableCell className="text-sm font-medium">{s.brand}</TableCell>
                  <TableCell className="text-sm text-accent">{s.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.stage}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${s.status === "Active" ? "border-primary/30 text-primary" : "border-accent/30 text-accent"}`}>
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Emerald Tracker */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading text-muted-foreground">Emerald Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground">£{foundation.emeraldCurrent.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/ £{foundation.emeraldTarget.toLocaleString()}</span>
          </div>
          <Progress value={emeraldPct} className="h-2" />
        </CardContent>
      </Card>

      {/* Foundation */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" /> Foundation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-heading font-bold text-foreground">{foundation.applicationStatus}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Application</p>
            </div>
            <div>
              <p className="text-lg font-heading font-bold text-accent">{foundation.grants}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Grants</p>
            </div>
            <div>
              <p className="text-lg font-heading font-bold text-primary">{foundation.eventProgress}%</p>
              <p className="text-[10px] text-muted-foreground uppercase">Event Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
