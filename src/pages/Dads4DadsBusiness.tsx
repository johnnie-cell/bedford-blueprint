import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadData, saveData } from "@/lib/storage";
import { Users, DollarSign, TrendingUp, Plus, GripVertical, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  priority: "high" | "med" | "low";
  done: boolean;
}

interface KPIs {
  members: number;
  revenue: number;
  newMembers: number;
}

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  med: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  low: "bg-primary/10 text-primary border-primary/30",
};

export default function Dads4DadsBusiness() {
  const [kpis, setKpis] = useState<KPIs>(() => loadData("d4d-kpis", { members: 0, revenue: 0, newMembers: 0 }));
  const [tasks, setTasks] = useState<Task[]>(() => loadData("d4d-tasks", []));
  const [weeklyFocus, setWeeklyFocus] = useState(() => loadData("d4d-focus", ""));
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "med" | "low">("med");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => { saveData("d4d-kpis", kpis); }, [kpis]);
  useEffect(() => { saveData("d4d-tasks", tasks); }, [tasks]);
  useEffect(() => { saveData("d4d-focus", weeklyFocus); }, [weeklyFocus]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((t) => [...t, { id: Date.now().toString(), text: newTask, priority: newPriority, done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks((t) => t.filter((task) => task.id !== id));
  };

  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setTasks((t) => {
      const arr = [...t];
      const [item] = arr.splice(dragIdx, 1);
      arr.splice(i, 0, item);
      return arr;
    });
    setDragIdx(i);
  };

  const kpiCards = [
    { label: "Community Members", value: kpis.members, icon: Users, key: "members" as const },
    { label: "Monthly Revenue", value: kpis.revenue, icon: DollarSign, key: "revenue" as const, prefix: "£" },
    { label: "New This Week", value: kpis.newMembers, icon: TrendingUp, key: "newMembers" as const },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-heading font-bold tracking-tight">Dads4Dads Business</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, key, prefix }) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <Input
                type="number"
                value={value || ""}
                onChange={(e) => setKpis((k) => ({ ...k, [key]: parseFloat(e.target.value) || 0 }))}
                className="text-2xl font-heading font-bold border-none p-0 h-auto bg-transparent shadow-none"
              />
              {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Focus */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Weekly Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's the main focus this week?"
            value={weeklyFocus}
            onChange={(e) => setWeeklyFocus(e.target.value)}
            className="resize-none min-h-[60px]"
          />
        </CardContent>
      </Card>

      {/* Task Board */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Task Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1"
            />
            <Select value={newPriority} onValueChange={(v: "high" | "med" | "low") => setNewPriority(v)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="med">Med</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" onClick={addTask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {tasks.map((task, i) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={() => setDragIdx(null)}
                className={`flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-muted/50 cursor-grab transition-colors ${
                  task.done ? "opacity-50" : ""
                }`}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} />
                <span className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : ""}`}>
                  {task.text}
                </span>
                <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add one above.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
