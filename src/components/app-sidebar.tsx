import * as React from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router";
import { cn } from "@/lib/utils";

export type NavigationType = {
  title: string;
  url: string;
  icon: IconName;
};

const navigation: NavigationType[] = [
  {
    title: "Tournaments",
    url: "/tournaments",
    icon: "trophy",
  },
  {
    title: "Teams",
    url: "/teams",
    icon: "shield",
  },
  {
    title: "Players",
    url: "/players",
    icon: "user",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className="px-4 flex flex-row items-center">
        <img src="/logo.svg" width={32} />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {navigation.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuButton
                  render={
                    <NavLink
                      title={item.title}
                      to={item.url}
                      className={cn(
                        "flex gap-2 items-center text-lg",
                        pathname === item.url && "bg-primary/50 text-primary-foreground",
                      )}
                    />
                  }
                >
                  <DynamicIcon name={item.icon} size={48} />
                </SidebarMenuButton>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
