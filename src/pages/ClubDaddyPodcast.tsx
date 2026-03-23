import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadData, saveData } from "@/lib/storage";
import { Plus, Trash2, Mic, Radio, Film, CheckCircle } from "lucide-react";

interface Episode {
  id: string;
  number: number;
  title: string;
  status: "idea" | "recorded" | "edited" | "published";
  publishDate: string;
}

interface ActionItem {
  id: string;
  text: string;
  done: boolean;
}

const statusColors = {
  idea: "bg-muted text-muted-foreground",
  recorded: "bg-chart-2/10 text-chart-2 border-chart-2/30",
  edited: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  published: "bg-primary/10 text-primary border-primary/30",
};

export default function ClubDaddyPodcast() {
  const [episodes, setEpisodes] = useState<Episode[]>(() => loadData("podcast-episodes", []));
  const [actions, setActions] = useState<ActionItem[]>(() => loadData("podcast-actions", []));
  const [ideas, setIdeas] = useState<string[]>(() => loadData("podcast-ideas", []));
  const [newIdea, setNewIdea] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newEp, setNewEp] = useState({ title: "", number: 1 });

  useEffect(() => { saveData("podcast-episodes", episodes); }, [episodes]);
  useEffect(() => { saveData("podcast-actions", actions); }, [actions]);
  useEffect(() => { saveData("podcast-ideas", ideas); }, [ideas]);

  const addEpisode = () => {
    if (!newEp.title.trim()) return;
    setEpisodes((e) => [
      ...e,
      { id: Date.now().toString(), number: newEp.number, title: newEp.title, status: "idea", publishDate: "" },
    ]);
    setNewEp({ title: "", number: (episodes.length || 0) + 2 });
  };

  const updateEpisode = (id: string, patch: Partial<Episode>) => {
    setEpisodes((e) => e.map((ep) => (ep.id === id ? { ...ep, ...patch } : ep)));
  };

  const stats = {
    total: episodes.length,
    published: episodes.filter((e) => e.status === "published").length,
    inProduction: episodes.filter((e) => e.status === "recorded" || e.status === "edited").length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-2xl font-heading font-bold tracking-tight">Club Daddy Podcast</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Episodes", value: stats.total, icon: Mic },
          { label: "Published", value: stats.published, icon: Radio },
          { label: "In Production", value: stats.inProduction, icon: Film },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-heading font-bold">{value}</p>
              </div>
              <Icon className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Episode Tracker */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Episodes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="#"
              value={newEp.number}
              onChange={(e) => setNewEp((n) => ({ ...n, number: parseInt(e.target.value) || 1 }))}
              className="w-16"
            />
            <Input
              placeholder="Episode title..."
              value={newEp.title}
              onChange={(e) => setNewEp((n) => ({ ...n, title: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addEpisode()}
              className="flex-1"
            />
            <Button onClick={addEpisode} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {episodes.map((ep) => (
              <div key={ep.id} className="flex items-center gap-2 p-2 rounded border bg-card">
                <span className="text-xs font-mono text-muted-foreground w-8">#{ep.number}</span>
                <span className="flex-1 text-sm font-medium">{ep.title}</span>
                <Select
                  value={ep.status}
                  onValueChange={(v: Episode["status"]) => updateEpisode(ep.id, { status: v })}
                >
                  <SelectTrigger className="w-28 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="recorded">Recorded</SelectItem>
                    <SelectItem value="edited">Edited</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={ep.publishDate}
                  onChange={(e) => updateEpisode(ep.id, { publishDate: e.target.value })}
                  className="w-36 h-8 text-xs"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setEpisodes((e) => e.filter((x) => x.id !== ep.id))}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Launch Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Launch Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add action item..."
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newAction.trim()) {
                  setActions((a) => [...a, { id: Date.now().toString(), text: newAction, done: false }]);
                  setNewAction("");
                }
              }}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={() => {
                if (newAction.trim()) {
                  setActions((a) => [...a, { id: Date.now().toString(), text: newAction, done: false }]);
                  setNewAction("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {actions.map((a) => (
            <div key={a.id} className="flex items-center gap-2 p-2 rounded border">
              <Checkbox
                checked={a.done}
                onCheckedChange={() => setActions((arr) => arr.map((x) => (x.id === a.id ? { ...x, done: !x.done } : x)))}
              />
              <span className={`flex-1 text-sm ${a.done ? "line-through text-muted-foreground" : ""}`}>{a.text}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setActions((arr) => arr.filter((x) => x.id !== a.id))}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ideas Backlog */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Ideas Backlog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="New episode idea..."
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newIdea.trim()) {
                  setIdeas((i) => [...i, newIdea]);
                  setNewIdea("");
                }
              }}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={() => {
                if (newIdea.trim()) {
                  setIdeas((i) => [...i, newIdea]);
                  setNewIdea("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ideas.map((idea, i) => (
              <Badge key={i} variant="secondary" className="text-sm py-1 px-3 gap-1">
                {idea}
                <button onClick={() => setIdeas((arr) => arr.filter((_, idx) => idx !== i))} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
