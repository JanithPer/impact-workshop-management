"use client"

import * as React from "react"
import {
  User,

  Package,
  ReceiptText,
  ArrowRightLeft,
  Calendar,
  BookOpen,

  Settings2,
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

// This is sample data.
const data = {
  user: {
    name: "Brad Evans",
    email: "brad@impactworkshop.com",
    avatar: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg.webp",
  },
  navMain: [
    {
      title: "Inventory",
      url: "#",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "All Parts",
          url: "/payments",
        },
        {
          title: "History",
          url: "/orders/repair-orders",
        },
        {
          title: "Low Stock",
          url: "/inventory",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ReceiptText,
      items: [
        {
          title: "Login",
          url: "/login",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Directory",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Users",
          url: "/settings/users",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Kanban",
      url: "#",
      icon: ArrowRightLeft,
    },
    {
      name: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      name: "Customers",
      url: "#",
      icon: User,
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
