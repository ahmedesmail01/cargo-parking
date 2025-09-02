"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Employees",
      url: "/admin/employees",
      icon: IconListDetails,
    },
    {
      title: "Parking State",
      url: "/admin/reports",
      icon: IconChartBar,
    },
    {
      title: "Control Panel",
      url: "/admin/control",
      icon: IconFolder,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  React.useEffect(() => {
    if (!token || user?.role !== "admin") {
      router.push("/login/admin");
    }
  }, [user, token, router]);
  return (
    <Sidebar collapsible="offcanvas" {...props} className="!p-4">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  Welink cargo parking
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="!p-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
