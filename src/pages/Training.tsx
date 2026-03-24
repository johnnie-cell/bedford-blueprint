import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getDashboard } from "@/lib/dashboardState";
import { Dumbbell, Droplets, Beef } from "lucide-react";

export default function Training() {
  const state = getDashboard();
  const { schedule, nutrition } = state.performance;

  // Find next incomplete session
  const nextIdx = schedule.findIndex(s => !s.completed && s.type !== "Rest");
  const proteinPct = Math.round((nutrition.proteinLogged / nutrition.proteinTarget) * 100);

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-xl font-heading font-bold">Training & Health</h2>

      {/* Weekly Grid */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" /> Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {schedule.map((s, i) => (
              <div
                key={s.day}
                className={`rounded-md p-3 text-center border transition-colors ${
                  i === nextIdx
                    ? "border-primary bg-primary/10"
                    : s.completed
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/30 bg-secondary/50"
                }`}
              >
                <p className="text-[10px] text-muted-foreground uppercase font-mono">{s.day}</p>
                <p className={`text-sm font-heading font-bold mt-1 ${s.completed ? "text-primary" : "text-foreground"}`}>
                  {s.type}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.duration}</p>
                {s.completed && (
                  <Badge variant="outline" className="text-[8px] mt-1 border-primary/30 text-primary">DONE</Badge>
                )}
                {i === nextIdx && (
                  <Badge className="text-[8px] mt-1 bg-primary text-primary-foreground">NEXT</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Beef className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Protein</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">
              {nutrition.proteinLogged}<span className="text-sm text-muted-foreground">/{nutrition.proteinTarget}g</span>
            </p>
            <Progress value={proteinPct} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-accent text-sm">🔥</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Calories</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{nutrition.calories}</p>
            <p className="text-[10px] text-muted-foreground">kcal today</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-chart-3" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Water</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{nutrition.water}L</p>
            <p className="text-[10px] text-muted-foreground">daily intake</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
