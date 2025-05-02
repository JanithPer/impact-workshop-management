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
        },
        {
          title: "Parts Inventory",
          url: "/inventory/parts-inventory",
        },
        {
          title: "Low Stock",
          url: "/underconstruction",
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
        },
        {
          title: "Recent Orders",
          url: "/underconstruction",
        },
        {
          title: "Job Page",
          url: "/orders/job",
        },
        {
          title: "Task Page",
          url: "/orders/job/task",
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
          url: "/directory",
        },
        {
          title: "Bookmarks",
          url: "/underconstruction",
        },
        {
          title: "AI Help",
          url: "/underconstruction",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/underconstruction",
        },
        {
          title: "Users",
          url: "/settings/users",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Kanban",
      url: "/kanban",
      icon: ArrowRightLeft,
    },
    {
      name: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      name: "Customers",
      url: "/customers",
      icon: User,
    },
    {
      name: "Login", // Note: Login might not belong in the main authenticated sidebar
      url: "/login",
      icon: Lock,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>

        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
