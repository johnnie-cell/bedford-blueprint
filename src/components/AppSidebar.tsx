import {
  LayoutDashboard,
  ListTodo,
  TrendingUp,
  FileText,
  Share2,
  Dumbbell,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Briefing", url: "/", icon: LayoutDashboard },
  { title: "Command Queue", url: "/tasks", icon: ListTodo },
  { title: "Pipeline", url: "/pipeline", icon: TrendingUp },
  { title: "Content", url: "/content", icon: FileText },
  { title: "Social Pulse", url: "/social", icon: Share2 },
  { title: "Training", url: "/training", icon: Dumbbell },
  { title: "Sponsors", url: "/sponsors", icon: Handshake },
  { title: "Legal Vault", url: "/legal", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 pb-2">
          {!collapsed && (
            <div>
              <h2 className="font-heading text-sm font-bold text-accent tracking-wider uppercase">
                Bedford HQ
              </h2>
              <p className="text-[10px] text-sidebar-foreground/50 mt-0.5 tracking-wide">
                Command Centre
              </p>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <span className="text-accent font-heading font-bold text-lg">B</span>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-accent font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
