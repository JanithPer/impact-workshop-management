"use client"

import * as React from "react"
import {
  User,
  Package,
  ReceiptText,
  ArrowRightLeft,
  Calendar,
  BookOpen,
  Settings,
  Lock,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import LogoHeader from "./logo-header"
import { useAuthStore } from "@/store/auth.store"


const data = {
  user: {
    name: "Brad Evans",
    email: "brad@impactworkshop.com",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  navMain: [
    {
      title: "Inventory",
      url: "#",
      icon: Package,

      items: [
        {
          title: "All Parts",
          url: "/inventory/parts",
          roles: ["admin", "user", "technician", "apprentice"],
        },
        {
          title: "Parts Inventory",
          url: "/inventory/parts-inventory",
          roles: ["admin", "user", "technician", "apprentice"],
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ReceiptText,
      items: [
        {
          title: "Repair Orders",
          url: "/orders/repair-orders",
          roles: ["admin", "user", "technician", "apprentice"],
        },
      ],
    },
    {
      title: "Directory",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Documents",
          url: "/directory/documents",
          roles: ["admin", "user", "technician", "apprentice"],
        },
        {
          title: "AI Help",
          url: "/directory/ai-help",
          roles: ["admin", "user", "technician", "apprentice"],
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Users",
          url: "/settings/users",
          roles: ["admin"],
        },
      ],
    },
  ],
  projects: [
    {
      name: "Kanban",
      url: "/kanban",
      icon: ArrowRightLeft,
      roles: ["admin", "user", "technician", "apprentice"],
    },
    {
      name: "Calendar",
      url: "/calendar",
      icon: Calendar,
      roles: ["admin", "user", "technician", "apprentice"],
    },
    {
      name: "Customers",
      url: "/customers",
      icon: User,
      roles: ["admin", "user", "technician", "apprentice"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  const navMain = data.navMain
    .map((item) => ({
      ...item,
      items: item.items.filter((subItem) =>
        subItem.roles ? subItem.roles.includes(user?.role || "") : true
      ),
    }))
    .filter((item) => item.items.length > 0)

  const projects = data.projects.filter((item) =>
    item.roles ? item.roles.includes(user?.role || "") : true
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>

        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
