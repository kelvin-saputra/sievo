"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserSchema } from "@/models/schemas"
import { data } from "@/static/sidebar-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"


export function NavMain() {
  const [user, setUser] = useState<Partial<UserSchema> | null>(null)
  const pathName = usePathname()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser")!)
    setUser(user)
  }, [])
  const userRole = user?.role || ""
  const userAdmin = user?.is_admin
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