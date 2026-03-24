import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboard } from "@/lib/dashboardState";
import { ShieldCheck, Download, AlertTriangle } from "lucide-react";

export default function LegalVault() {
  const state = getDashboard();

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-xl font-heading font-bold">Legal Vault</h2>

      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" /> Document Vault
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.legalVault.map(doc => (
            <div key={doc.id} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
              <div className="flex items-center gap-3">
                {doc.urgent && <AlertTriangle className="h-4 w-4 text-destructive" />}
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px] border-border/50">{doc.type}</Badge>
                    <span className="text-[10px] text-muted-foreground">{doc.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.urgent && (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
                    URGENT
                  </Badge>
                )}
                <Button size="sm" variant="outline" className="h-7 text-xs border-border">
                  <Download className="h-3 w-3 mr-1" /> Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
