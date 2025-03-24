import { Wrench } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

const LogoHeader = () => {
  return (
    <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <a href="/">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Wrench className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Impact Workshop</span>
            <span className="">Management</span>
          </div>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
  )
}

export default LogoHeader