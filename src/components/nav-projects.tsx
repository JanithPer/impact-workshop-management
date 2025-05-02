"use client"

import { usePathname } from "next/navigation" 
import type { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname() 

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => {
          const isActive = pathname.startsWith(project.url) 
          return (
            <SidebarMenuItem key={project.name}>
              
              <SidebarMenuButton tooltip={project.name} asChild data-active={isActive}>
                <a href={project.url}>
                  {project.icon && <project.icon />}
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
