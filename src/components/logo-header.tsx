import Image from "next/image"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { useSidebar } from "./ui/sidebar" 

const LogoHeader = () => {
  const { state } = useSidebar() 
  return (
    <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <a href="/">
            {/* Light mode logo */}
            <div className="flex items-center gap-3.5">
            <Image
                src="/images/logo.png"
                alt="Impact Workshop Logo"
                width={state === "collapsed" ? 22 : 38}
                height={state === "collapsed" ? 22 : 38}
                className="block dark:hidden"
              />
              {/* Dark mode logo */}
              <Image
                src="/images/logo-white.png"
                alt="Impact Workshop Logo"
                width={state === "collapsed" ? 22 : 38}
                height={state === "collapsed" ? 22 : 38}
                className="hidden dark:block"
              />
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Impact Workshop</span>
            <span className="">Management</span>
          </div>
          </div>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
  )
}

export default LogoHeader