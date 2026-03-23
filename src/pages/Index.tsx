import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { loadData } from "@/lib/storage";
import { Dumbbell, Users, Heart, Mic, Megaphone, Waves, Bike, PersonStanding, Flame } from "lucide-react";
import { Link } from "react-router-dom";

function WidgetCard({ title, icon: Icon, to, children }: { title: string; icon: React.ElementType; to: string; children: React.ReactNode }) {
  return (
    <Link to={to}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">{children}</CardContent>
      </Card>
    </Link>
  );
}

export default function Index() {
  const sessions = loadData("ironman-sessions", Array(7).fill({ type: "rest", completed: false, distance: 0, notes: "" }));
  const phase = loadData("ironman-phase", "Base");
  const raceDate = loadData("ironman-race-date", "");
  const kpis = loadData("d4d-kpis", { members: 0, revenue: 0, newMembers: 0 });
  const launchProgress = loadData("foundation-progress", 0);
  const episodes = loadData<Array<{ status: string }>>("podcast-episodes", []);
  const posts = loadData<Array<{ date: string }>>("brand-posts", []);
  const weeklyTarget = loadData("brand-target", 5);
  const streak = loadData("brand-streak", 0);

  const completedSessions = sessions.filter((s: any) => s.completed).length;
  const daysToRace = raceDate ? Math.max(0, Math.ceil((new Date(raceDate).getTime() - Date.now()) / 86400000)) : null;
  const publishedEps = episodes.filter((e) => e.status === "published").length;

  // This week's posts
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  monday.setHours(0, 0, 0, 0);
  const thisWeekPosts = posts.filter((p) => new Date(p.date) >= monday).length;

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-2xl font-heading font-bold tracking-tight">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WidgetCard title="Ironman Training" icon={Dumbbell} to="/ironman">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">This week</span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">{phase}</Badge>
          </div>
          <p className="font-heading font-bold text-lg">{completedSessions}/7 sessions</p>
          {daysToRace !== null && (
            <p className="text-xs text-muted-foreground">{daysToRace} days to race day</p>
          )}
        </WidgetCard>

        <WidgetCard title="Dads4Dads Business" icon={Users} to="/business">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-heading font-bold text-lg">{kpis.members}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div>
              <p className="font-heading font-bold text-lg">£{kpis.revenue}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
            <div>
              <p className="font-heading font-bold text-lg">+{kpis.newMembers}</p>
              <p className="text-xs text-muted-foreground">New</p>
            </div>
          </div>
        </WidgetCard>

        <WidgetCard title="D4D Foundation" icon={Heart} to="/foundation">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Launch Progress</span>
              <span className="font-bold text-primary">{launchProgress}%</span>
            </div>
            <Progress value={launchProgress} className="h-2" />
          </div>
        </WidgetCard>

        <WidgetCard title="Club Daddy Podcast" icon={Mic} to="/podcast">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="font-heading font-bold text-lg">{episodes.length}</p>
              <p className="text-xs text-muted-foreground">Total Eps</p>
            </div>
            <div>
              <p className="font-heading font-bold text-lg">{publishedEps}</p>
              <p className="text-xs text-muted-foreground">Published</p>
            </div>
          </div>
        </WidgetCard>

        <WidgetCard title="Personal Brand" icon={Megaphone} to="/brand">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-bold text-lg">{thisWeekPosts}/{weeklyTarget}</p>
              <p className="text-xs text-muted-foreground">Posts this week</p>
            </div>
            <div className="flex items-center gap-1 text-chart-3">
              <Flame className="h-4 w-4" />
              <span className="font-heading font-bold">{streak}</span>
            </div>
          </div>
          <Progress value={Math.min(100, (thisWeekPosts / weeklyTarget) * 100)} className="h-1.5" />
        </WidgetCard>
      </div>
    </div>
  );
}
