import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadData, saveData } from "@/lib/storage";
import { Plus, Trash2, Flame, Target } from "lucide-react";

interface Post {
  id: string;
  platform: string;
  type: string;
  date: string;
}

export default function PersonalBrand() {
  const [weeklyTarget, setWeeklyTarget] = useState(() => loadData("brand-target", 5));
  const [pillars, setPillars] = useState<string[]>(() => loadData("brand-pillars", ["Fatherhood", "Entrepreneurship", "Athletic Performance"]));
  const [posts, setPosts] = useState<Post[]>(() => loadData("brand-posts", []));
  const [editingPillar, setEditingPillar] = useState<number | null>(null);
  const [streak, setStreak] = useState(() => loadData("brand-streak", 0));
  const [newPost, setNewPost] = useState({ platform: "LinkedIn", type: "Post", date: new Date().toISOString().split("T")[0] });

  useEffect(() => { saveData("brand-target", weeklyTarget); }, [weeklyTarget]);
  useEffect(() => { saveData("brand-pillars", pillars); }, [pillars]);
  useEffect(() => { saveData("brand-posts", posts); }, [posts]);
  useEffect(() => { saveData("brand-streak", streak); }, [streak]);

  // Count posts this week (Mon-Sun)
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  monday.setHours(0, 0, 0, 0);
  const thisWeekPosts = posts.filter((p) => new Date(p.date) >= monday).length;
  const weekPct = Math.min(100, (thisWeekPosts / weeklyTarget) * 100);

  const addPost = () => {
    setPosts((p) => [...p, { ...newPost, id: Date.now().toString() }]);
    setNewPost({ ...newPost, date: new Date().toISOString().split("T")[0] });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-heading font-bold tracking-tight">Personal Brand</h2>

      {/* Weekly Goal + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Weekly Content Goal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-heading font-bold text-primary">{thisWeekPosts}</span>
                <span className="text-muted-foreground">/</span>
                <Input
                  type="number"
                  value={weeklyTarget}
                  onChange={(e) => setWeeklyTarget(parseInt(e.target.value) || 1)}
                  className="w-14 h-8 text-center"
                />
              </div>
            </div>
            <Progress value={weekPct} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-chart-3" />
              <span className="font-medium text-sm">Weekly Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-heading font-bold">{streak}</span>
              <span className="text-sm text-muted-foreground">weeks</span>
              <div className="flex gap-1 ml-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setStreak((s) => Math.max(0, s - 1))}>
                  −
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setStreak((s) => s + 1)}>
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Pillars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Content Pillars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {pillars.map((pillar, i) => (
              <div key={i}>
                {editingPillar === i ? (
                  <Input
                    value={pillar}
                    onChange={(e) => setPillars((p) => p.map((x, idx) => (idx === i ? e.target.value : x)))}
                    onBlur={() => setEditingPillar(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingPillar(null)}
                    className="w-48"
                    autoFocus
                  />
                ) : (
                  <Badge
                    variant="outline"
                    className="text-sm py-2 px-4 cursor-pointer hover:bg-muted border-primary/30 text-primary"
                    onClick={() => setEditingPillar(i)}
                  >
                    {pillar}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Post Log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Post Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Select value={newPost.platform} onValueChange={(v) => setNewPost((n) => ({ ...n, platform: v }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["LinkedIn", "Twitter/X", "Instagram", "YouTube", "TikTok", "Newsletter"].map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newPost.type} onValueChange={(v) => setNewPost((n) => ({ ...n, type: v }))}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Post", "Reel", "Story", "Video", "Article", "Thread"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newPost.date}
              onChange={(e) => setNewPost((n) => ({ ...n, date: e.target.value }))}
              className="w-40"
            />
            <Button onClick={addPost}>
              <Plus className="h-4 w-4 mr-1" /> Log Post
            </Button>
          </div>
          <div className="space-y-1">
            {posts.slice().reverse().map((post) => (
              <div key={post.id} className="flex items-center gap-2 p-2 rounded border bg-card text-sm">
                <Badge variant="secondary">{post.platform}</Badge>
                <Badge variant="outline">{post.type}</Badge>
                <span className="text-muted-foreground text-xs ml-auto">{post.date}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setPosts((p) => p.filter((x) => x.id !== post.id))}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
