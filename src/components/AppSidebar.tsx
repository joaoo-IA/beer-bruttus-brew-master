import { LayoutDashboard, DollarSign, Package, Beer, StickyNote, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Estoque", url: "/estoque", icon: Package },
  { title: "Produtos", url: "/produtos", icon: Beer },
  { title: "Notas", url: "/notas", icon: StickyNote },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Beer className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-golden">Beer Bruttus</h2>
                <p className="text-xs text-muted-foreground">Gestão Artesanal</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Beer className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-sidebar-accent"
                        activeClassName="bg-gradient-to-r from-primary/20 to-accent/10 border-l-4 border-primary"
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        {!isCollapsed && (
                          <span className={isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
