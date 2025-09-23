import { useState } from "react";
import { 
  Home, 
  Monitor, 
  MessageSquare, 
  BarChart3, 
  FileText, 
  Settings,
  Satellite
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Monitoring", url: "/monitoring", icon: Monitor },
  { title: "Companion Chat", url: "/chat", icon: MessageSquare },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Mission Report", url: "/mission-report", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Satellite className="h-6 w-6 text-primary" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">AstroBot</h2>
                <p className="text-xs text-sidebar-foreground/60">Mission Control</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Mission Status */}
        {state !== "collapsed" && (
          <div className="p-4 mt-auto border-t border-sidebar-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/60">Mission Day</span>
                <span className="text-sidebar-foreground font-mono">124</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/60">Status</span>
                <div className="flex items-center gap-1">
                  <div className="status-indicator nominal"></div>
                  <span className="text-nominal font-medium">Nominal</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>

      {/* Trigger positioned at top right of sidebar */}
      <SidebarTrigger className="absolute -right-4 top-4 bg-sidebar-background border border-sidebar-border" />
    </Sidebar>
  );
}