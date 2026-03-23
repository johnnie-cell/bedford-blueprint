import {
  Home,
  Dumbbell,
  Users,
  Heart,
  Mic,
  Megaphone,
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
  { title: "Overview", url: "/", icon: Home },
  { title: "Ironman Training", url: "/ironman", icon: Dumbbell },
  { title: "Dads4Dads Business", url: "/business", icon: Users },
  { title: "D4D Foundation", url: "/foundation", icon: Heart },
  { title: "Club Daddy Podcast", url: "/podcast", icon: Mic },
  { title: "Personal Brand", url: "/brand", icon: Megaphone },
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
              <h2 className="font-heading text-base font-bold text-sidebar-primary tracking-tight">
                The Bedford Dashboard
              </h2>
              <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                Dad · Entrepreneur · Athlete
              </p>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <span className="text-sidebar-primary font-heading font-bold text-lg">B</span>
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
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
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
