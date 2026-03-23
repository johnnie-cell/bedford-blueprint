import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { loadData, saveData } from "@/lib/storage";
import { Plus, Trash2 } from "lucide-react";

interface Milestone {
  id: string;
  text: string;
  status: "not started" | "in progress" | "done";
  week: number;
}

const statusColors = {
  "not started": "bg-muted text-muted-foreground",
  "in progress": "bg-chart-3/10 text-chart-3 border-chart-3/30",
  done: "bg-primary/10 text-primary border-primary/30",
};

export default function Dads4DadsFoundation() {
  const [launchProgress, setLaunchProgress] = useState(() => loadData("foundation-progress", 0));
  const [milestones, setMilestones] = useState<Milestone[]>(() => loadData("foundation-milestones", []));
  const [notes, setNotes] = useState(() => loadData("foundation-notes", ""));
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => { saveData("foundation-progress", launchProgress); }, [launchProgress]);
  useEffect(() => { saveData("foundation-milestones", milestones); }, [milestones]);
  useEffect(() => { saveData("foundation-notes", notes); }, [notes]);

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setMilestones((m) => [
      ...m,
      { id: Date.now().toString(), text: newMilestone, status: "not started", week: 1 },
    ]);
    setNewMilestone("");
  };

  const updateMilestone = (id: string, patch: Partial<Milestone>) => {
    setMilestones((m) => m.map((ms) => (ms.id === id ? { ...ms, ...patch } : ms)));
  };

  const deleteMilestone = (id: string) => {
    setMilestones((m) => m.filter((ms) => ms.id !== id));
  };

  const weeks = Array.from({ length: 13 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-2xl font-heading font-bold tracking-tight">Dads4Dads Foundation</h2>

      {/* Launch Progress */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">Launch Progress</span>
            <span className="text-2xl font-heading font-bold text-primary">{launchProgress}%</span>
          </div>
          <Progress value={launchProgress} className="h-3" />
          <Input
            type="range"
            min={0}
            max={100}
            value={launchProgress}
            onChange={(e) => setLaunchProgress(parseInt(e.target.value))}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Milestone Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add milestone..."
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMilestone()}
              className="flex-1"
            />
            <Button size="icon" onClick={addMilestone}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {milestones.map((ms) => (
              <div key={ms.id} className="flex items-center gap-2 p-2 rounded border bg-card">
                <span className="flex-1 text-sm">{ms.text}</span>
                <Select
                  value={ms.status}
                  onValueChange={(v: Milestone["status"]) => updateMilestone(ms.id, { status: v })}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not started">Not Started</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={ms.week.toString()}
                  onValueChange={(v) => updateMilestone(ms.id, { week: parseInt(v) })}
                >
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map((w) => (
                      <SelectItem key={w} value={w.toString()}>Wk {w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className={`text-xs ${statusColors[ms.status]}`}>
                  {ms.status}
                </Badge>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteMilestone(ms.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 90-Day Roadmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">90-Day Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-4" style={{ minWidth: weeks.length * 100 }}>
              {weeks.map((w) => {
                const weekMilestones = milestones.filter((m) => m.week === w);
                return (
                  <div key={w} className="min-w-[90px] border rounded-lg p-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Week {w}</p>
                    {weekMilestones.map((m) => (
                      <div key={m.id} className="text-xs mb-1 p-1 rounded bg-muted">
                        <span className={m.status === "done" ? "line-through text-muted-foreground" : ""}>
                          {m.text}
                        </span>
                      </div>
                    ))}
                    {weekMilestones.length === 0 && (
                      <p className="text-xs text-muted-foreground/50">—</p>
                    )}
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Foundation notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
