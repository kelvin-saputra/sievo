"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { data } from "@/static/sidebar-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"


export function NavMain() {
  const pathName = usePathname()
  const user = JSON.parse(localStorage.getItem("authUser")!)
  const userRole = user.role
  const userAdmin = user.is_admin
  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.navMain.map((item) => (
          (item.roles.includes(userRole) || userAdmin) && (
            <Link key={item.title} href={item.url}>
              <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={`group hover:cursor-pointer ${pathName.split('/')[1].toLowerCase() === item.url.split('/')[1].toLowerCase() ? 'bg-reguler-blue-matahati/50' : ''}`}
                  >
                    {item.icon && (
                      <span
                        dangerouslySetInnerHTML={{ __html: item.icon }}
                        className="mr-2 text-sm font-medium text-white"
                      />
                    )}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}