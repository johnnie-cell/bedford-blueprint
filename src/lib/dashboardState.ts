import { loadData, saveData } from "./storage";

export interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: "today" | "next" | "waiting" | "completed";
  priority: "high" | "med" | "low";
  details: string;
  assets: Array<{ name: string; url: string }>;
}

export interface PipelineDeal {
  id: string;
  name: string;
  value: string;
  stage: string;
  status: "open" | "closed";
  nextStep: string;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: string;
  type: string;
  date: string;
  status: "draft" | "scheduled" | "published";
}

export interface TrainingSession {
  day: string;
  type: string;
  duration: string;
  completed: boolean;
  notes: string;
}

export interface SponsorDeal {
  id: string;
  brand: string;
  value: string;
  stage: string;
  status: string;
}

export interface LegalDoc {
  id: string;
  title: string;
  type: string;
  date: string;
  urgent: boolean;
  downloadUrl: string;
}

export interface DashboardState {
  quickMetrics: {
    leadsToday: number;
    bookedCalls: number;
    revenue: string;
    workouts: number;
    emailSends: number;
  };
  topPriorities: Array<{ id: string; text: string; done: boolean }>;
  quote: string;
  tasks: Task[];
  pipeline: PipelineDeal[];
  automations: Array<{ name: string; status: "active" | "paused"; lastRun: string }>;
  content: { calendar: ContentItem[] };
  socialPulse: {
    followers: { instagram: number; linkedin: number; youtube: number; tiktok: number };
    recentPosts: Array<{ platform: string; text: string; engagement: string }>;
    angles: string[];
  };
  performance: {
    schedule: TrainingSession[];
    nutrition: { proteinTarget: number; proteinLogged: number; calories: number; water: number };
  };
  sponsors: SponsorDeal[];
  foundation: {
    applicationStatus: string;
    grants: number;
    eventProgress: number;
    emeraldTarget: number;
    emeraldCurrent: number;
  };
  legalVault: LegalDoc[];
}

const defaultState: DashboardState = {
  quickMetrics: {
    leadsToday: 12,
    bookedCalls: 3,
    revenue: "£14,200",
    workouts: 5,
    emailSends: 340,
  },
  topPriorities: [
    { id: "p1", text: "Close Hyrox sponsor deal", done: false },
    { id: "p2", text: "Record Club Daddy Ep 14", done: false },
    { id: "p3", text: "Submit Foundation grant application", done: true },
    { id: "p4", text: "Finalize Q2 content calendar", done: false },
  ],
  quote: "Discipline is choosing between what you want now and what you want most.",
  tasks: [
    { id: "t1", title: "Film podcast intro", owner: "Johnnie", dueDate: "2026-03-24", status: "today", priority: "high", details: "Film the opening segment for episode 14.", assets: [] },
    { id: "t2", title: "Review sponsor contract", owner: "Johnnie", dueDate: "2026-03-25", status: "today", priority: "high", details: "Legal review needed for Hyrox deal.", assets: [] },
    { id: "t3", title: "Write newsletter", owner: "Johnnie", dueDate: "2026-03-26", status: "next", priority: "med", details: "Weekly D4D newsletter draft.", assets: [] },
    { id: "t4", title: "Update website copy", owner: "VA", dueDate: "2026-03-27", status: "next", priority: "low", details: "Refresh About page.", assets: [] },
    { id: "t5", title: "Awaiting guest confirmation", owner: "Guest", dueDate: "2026-03-28", status: "waiting", priority: "med", details: "Podcast guest for episode 15.", assets: [] },
    { id: "t6", title: "Social media batch", owner: "Johnnie", dueDate: "2026-03-20", status: "completed", priority: "med", details: "Batch of 10 posts created.", assets: [] },
  ],
  pipeline: [
    { id: "d1", name: "Hyrox Partnership", value: "£5,000", stage: "Negotiation", status: "open", nextStep: "Send revised proposal" },
    { id: "d2", name: "D4D Membership Upsell", value: "£2,400", stage: "Proposal Sent", status: "open", nextStep: "Follow up call Friday" },
    { id: "d3", name: "Podcast Sponsorship", value: "£1,200", stage: "Closed Won", status: "closed", nextStep: "Invoice sent" },
  ],
  automations: [
    { name: "Welcome Email", status: "active", lastRun: "2026-03-23" },
    { name: "Trial Reminders", status: "active", lastRun: "2026-03-24" },
    { name: "Foundation 50% Offer", status: "paused", lastRun: "2026-03-15" },
  ],
  content: {
    calendar: [
      { id: "c1", title: "Ironman prep vlog", platform: "YouTube", type: "Video", date: "2026-03-25", status: "scheduled" },
      { id: "c2", title: "Dad wins carousel", platform: "Instagram", type: "Carousel", date: "2026-03-26", status: "draft" },
      { id: "c3", title: "Founder Friday post", platform: "LinkedIn", type: "Post", date: "2026-03-28", status: "draft" },
      { id: "c4", title: "Club Daddy Ep 14", platform: "Spotify", type: "Podcast", date: "2026-03-30", status: "scheduled" },
    ],
  },
  socialPulse: {
    followers: { instagram: 12400, linkedin: 8200, youtube: 3100, tiktok: 5600 },
    recentPosts: [
      { platform: "Instagram", text: "Morning swim session 🏊", engagement: "4.2%" },
      { platform: "LinkedIn", text: "Why dads need community", engagement: "6.8%" },
    ],
    angles: ["Race prep behind-the-scenes", "Dad hack of the week", "Sponsor spotlight"],
  },
  performance: {
    schedule: [
      { day: "Mon", type: "Swim", duration: "60 min", completed: true, notes: "Open water" },
      { day: "Tue", type: "Bike", duration: "90 min", completed: true, notes: "Hill intervals" },
      { day: "Wed", type: "Run", duration: "45 min", completed: false, notes: "Easy pace" },
      { day: "Thu", type: "Strength", duration: "60 min", completed: false, notes: "Upper body" },
      { day: "Fri", type: "Swim", duration: "45 min", completed: false, notes: "Drills" },
      { day: "Sat", type: "Brick", duration: "120 min", completed: false, notes: "Bike → Run" },
      { day: "Sun", type: "Rest", duration: "—", completed: false, notes: "" },
    ],
    nutrition: { proteinTarget: 180, proteinLogged: 142, calories: 2800, water: 3.2 },
  },
  sponsors: [
    { id: "s1", brand: "Hyrox", value: "£5,000", stage: "Negotiation", status: "Active" },
    { id: "s2", brand: "MyProtein", value: "£1,500", stage: "Outreach", status: "Pending" },
    { id: "s3", brand: "Wahoo", value: "£3,000", stage: "Proposal Sent", status: "Active" },
  ],
  foundation: {
    applicationStatus: "Submitted",
    grants: 2,
    eventProgress: 65,
    emeraldTarget: 50000,
    emeraldCurrent: 32000,
  },
  legalVault: [
    { id: "l1", title: "Hyrox Sponsorship Agreement", type: "Contract", date: "2026-03-22", urgent: true, downloadUrl: "#" },
    { id: "l2", title: "Foundation CIC Registration", type: "Registration", date: "2026-03-18", urgent: false, downloadUrl: "#" },
    { id: "l3", title: "Podcast Guest Release", type: "Release Form", date: "2026-03-15", urgent: false, downloadUrl: "#" },
  ],
};

const STATE_KEY = "bedford-dashboard-state";

export function getDashboard(): DashboardState {
  return loadData<DashboardState>(STATE_KEY, defaultState);
}

export function saveDashboard(state: DashboardState) {
  saveData(STATE_KEY, state);
}

export function updateTasks(tasks: Task[]) {
  const s = getDashboard();
  s.tasks = tasks;
  saveDashboard(s);
}

export function addTask(task: Task) {
  const s = getDashboard();
  s.tasks.push(task);
  saveDashboard(s);
}

export function completeTask(id: string) {
  const s = getDashboard();
  s.tasks = s.tasks.map(t => t.id === id ? { ...t, status: "completed" as const } : t);
  saveDashboard(s);
}

export function updatePriority(id: string, done: boolean) {
  const s = getDashboard();
  s.topPriorities = s.topPriorities.map(p => p.id === id ? { ...p, done } : p);
  saveDashboard(s);
}

// Simulate API calls
export async function apiCall(endpoint: string, _body?: any): Promise<{ ok: boolean }> {
  console.log(`[API] ${endpoint}`, _body);
  return { ok: true };
}
