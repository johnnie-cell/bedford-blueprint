import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboard } from "@/lib/dashboardState";
import { FileText } from "lucide-react";

const statusColor: Record<string, string> = {
  draft: "border-muted-foreground/30 text-muted-foreground",
  scheduled: "border-accent/30 text-accent",
  published: "border-primary/30 text-primary",
};

export default function ContentPage() {
  const state = getDashboard();

  return (
    <div className="space-y-6 max-w-6xl">
      <h2 className="text-xl font-heading font-bold">Content Calendar</h2>

      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" /> Upcoming Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground text-xs">Title</TableHead>
                <TableHead className="text-muted-foreground text-xs">Platform</TableHead>
                <TableHead className="text-muted-foreground text-xs">Type</TableHead>
                <TableHead className="text-muted-foreground text-xs">Date</TableHead>
                <TableHead className="text-muted-foreground text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.content.calendar.map(c => (
                <TableRow key={c.id} className="border-border/20">
                  <TableCell className="text-sm font-medium">{c.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.platform}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusColor[c.status]}`}>
                      {c.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
