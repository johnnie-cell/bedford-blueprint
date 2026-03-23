import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadData, saveData } from "@/lib/storage";
import { CalendarIcon, Waves, Bike, PersonStanding } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SESSION_TYPES = ["swim", "bike", "run", "brick", "rest"] as const;
const PHASES = ["Base", "Build", "Peak", "Taper"] as const;

interface Session {
  type: string;
  completed: boolean;
  distance: number;
  notes: string;
}

interface NutritionDay {
  calories: number;
  protein: number;
  carbs: number;
  water: number;
}

const defaultSessions: Session[] = DAYS.map(() => ({
  type: "rest",
  completed: false,
  distance: 0,
  notes: "",
}));

const TARGETS = { swim: 3.8, bike: 180, run: 42 };

export default function IronmanTraining() {
  const [sessions, setSessions] = useState<Session[]>(() => loadData("ironman-sessions", defaultSessions));
  const [raceDate, setRaceDate] = useState(() => loadData("ironman-race-date", ""));
  const [phase, setPhase] = useState(() => loadData("ironman-phase", "Base"));
  const [nutrition, setNutrition] = useState<NutritionDay>(() =>
    loadData("ironman-nutrition", { calories: 0, protein: 0, carbs: 0, water: 0 })
  );
  const [nutTargets] = useState(() =>
    loadData("ironman-nut-targets", { calories: 2800, protein: 180, carbs: 350, water: 3 })
  );

  useEffect(() => { saveData("ironman-sessions", sessions); }, [sessions]);
  useEffect(() => { saveData("ironman-race-date", raceDate); }, [raceDate]);
  useEffect(() => { saveData("ironman-phase", phase); }, [phase]);
  useEffect(() => { saveData("ironman-nutrition", nutrition); }, [nutrition]);

  const updateSession = (i: number, patch: Partial<Session>) => {
    setSessions((s) => s.map((ses, idx) => (idx === i ? { ...ses, ...patch } : ses)));
  };

  const totals = sessions.reduce(
    (acc, s) => {
      if (s.completed && s.type !== "rest" && s.type !== "brick") {
        acc[s.type] = (acc[s.type] || 0) + s.distance;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const daysUntilRace = raceDate
    ? Math.max(0, Math.ceil((new Date(raceDate).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold tracking-tight">Ironman Training & Nutrition</h2>
        <div className="flex items-center gap-3">
          <Select value={phase} onValueChange={(v) => { setPhase(v); saveData("ironman-phase", v); }}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHASES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-heading">
            {phase} Phase
          </Badge>
        </div>
      </div>

      {/* Race countdown */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm font-medium">Race Day:</span>
            <Input
              type="date"
              value={raceDate}
              onChange={(e) => setRaceDate(e.target.value)}
              className="w-44"
            />
          </div>
          {daysUntilRace !== null && (
            <div className="text-right">
              <span className="text-3xl font-heading font-bold text-primary">{daysUntilRace}</span>
              <span className="text-sm text-muted-foreground ml-1">days to go</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distance progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {([
          { key: "swim", label: "Swim", target: TARGETS.swim, unit: "km", icon: Waves },
          { key: "bike", label: "Bike", target: TARGETS.bike, unit: "km", icon: Bike },
          { key: "run", label: "Run", target: TARGETS.run, unit: "km", icon: PersonStanding },
        ] as const).map(({ key, label, target, unit, icon: Icon }) => {
          const current = totals[key] || 0;
          const pct = Math.min(100, (current / target) * 100);
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{label}</span>
                </div>
                <Progress value={pct} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">
                  {current.toFixed(1)} / {target} {unit} ({pct.toFixed(0)}%)
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Weekly Training</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {DAYS.map((day, i) => (
              <div key={day} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">{day}</span>
                  <Checkbox
                    checked={sessions[i].completed}
                    onCheckedChange={(c) => updateSession(i, { completed: !!c })}
                  />
                </div>
                <Select
                  value={sessions[i].type}
                  onValueChange={(v) => updateSession(i, { type: v })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs capitalize">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sessions[i].type !== "rest" && (
                  <Input
                    type="number"
                    placeholder="km"
                    value={sessions[i].distance || ""}
                    onChange={(e) => updateSession(i, { distance: parseFloat(e.target.value) || 0 })}
                    className="h-8 text-xs"
                  />
                )}
                <Textarea
                  placeholder="Notes..."
                  value={sessions[i].notes}
                  onChange={(e) => updateSession(i, { notes: e.target.value })}
                  className="text-xs min-h-[48px] resize-none"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Daily Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              { key: "calories" as const, label: "Calories", unit: "kcal", target: nutTargets.calories },
              { key: "protein" as const, label: "Protein", unit: "g", target: nutTargets.protein },
              { key: "carbs" as const, label: "Carbs", unit: "g", target: nutTargets.carbs },
              { key: "water" as const, label: "Water", unit: "L", target: nutTargets.water },
            ]).map(({ key, label, unit, target }) => {
              const pct = Math.min(100, (nutrition[key] / target) * 100);
              return (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-medium">{label}</label>
                  <Input
                    type="number"
                    value={nutrition[key] || ""}
                    onChange={(e) =>
                      setNutrition((n) => ({ ...n, [key]: parseFloat(e.target.value) || 0 }))
                    }
                    className="h-8"
                  />
                  <Progress value={pct} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">
                    {nutrition[key]} / {target} {unit}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
