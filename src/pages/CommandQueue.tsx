import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getDashboard, saveDashboard, type Task } from "@/lib/dashboardState";
import { Plus, CheckCircle2, Paperclip } from "lucide-react";

const columns: { key: Task["status"]; label: string }[] = [
  { key: "today", label: "Do Today" },
  { key: "next", label: "Next" },
  { key: "waiting", label: "Waiting" },
  { key: "completed", label: "Completed" },
];

const priorityColor: Record<string, string> = {
  high: "border-destructive/50 text-destructive",
  med: "border-accent/50 text-accent",
  low: "border-muted-foreground/50 text-muted-foreground",
};

export default function CommandQueue() {
  const [state, setState] = useState(getDashboard);
  const [selected, setSelected] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", owner: "Johnnie", dueDate: "", priority: "med" as Task["priority"] });

  const refresh = () => setState(getDashboard());

  const markDone = (id: string) => {
    const s = getDashboard();
    s.tasks = s.tasks.map(t => t.id === id ? { ...t, status: "completed" as const } : t);
    saveDashboard(s);
    setSelected(null);
    refresh();
  };

  const handleAdd = () => {
    if (!newTask.title) return;
    const s = getDashboard();
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTask.title,
      owner: newTask.owner,
      dueDate: newTask.dueDate,
      status: "today",
      priority: newTask.priority,
      details: "",
      assets: [],
    };
    s.tasks.push(task);
    saveDashboard(s);
    setNewTask({ title: "", owner: "Johnnie", dueDate: "", priority: "med" });
    setAddOpen(false);
    refresh();
  };

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Command Queue</h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading">New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Owner</Label>
                  <Input value={newTask.owner} onChange={e => setNewTask(p => ({ ...p, owner: e.target.value }))} className="bg-secondary border-border" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Due Date</Label>
                  <Input type="date" value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))} className="bg-secondary border-border" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v as Task["priority"] }))}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="med">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="w-full bg-primary text-primary-foreground">Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col.key} className="space-y-2">
            <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">{col.label}</h3>
            <div className="space-y-2 min-h-[200px]">
              {state.tasks.filter(t => t.status === col.key).map(task => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:border-accent/40 transition-colors bg-card/80 border-border/50"
                  onClick={() => setSelected(task)}
                >
                  <CardContent className="p-3">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className={`text-[10px] ${priorityColor[task.priority]}`}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{task.owner}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent className="bg-card border-border w-[400px]">
          {selected && (
            <div className="space-y-4 mt-6">
              <SheetHeader>
                <SheetTitle className="font-heading text-foreground">{selected.title}</SheetTitle>
              </SheetHeader>
              <div className="space-y-3">
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Owner: {selected.owner}</span>
                  <span>•</span>
                  <span>Due: {selected.dueDate}</span>
                </div>
                <p className="text-sm text-foreground/80">{selected.details || "No details."}</p>

                <div>
                  <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <Paperclip className="h-3 w-3" /> Assets
                  </h4>
                  {selected.assets.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No assets attached.</p>
                  ) : (
                    selected.assets.map((a, i) => (
                      <p key={i} className="text-xs text-primary underline">{a.name}</p>
                    ))
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  {selected.status !== "completed" && (
                    <Button size="sm" onClick={() => markDone(selected.id)} className="bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Done
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-border text-muted-foreground">
                    <Paperclip className="h-4 w-4 mr-1" /> Upload Asset
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
