"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { NavMain } from "@/components/common/nav-main"
import { NavFooter } from "@/components/common/nav-footer"
import { NavHeader } from "@/components/common/nav-header"
import { userData } from "@/static/user"

export function SidebarApp({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
        <Sidebar collapsible="icon" {...props} >
        <SidebarHeader>
          <NavHeader />
        </SidebarHeader>
        <SidebarContent>
          <NavMain user={userData} />
        </SidebarContent>
        <SidebarFooter>
          <NavFooter user={userData} />
        </SidebarFooter>
        </Sidebar>
    </>
  )
}
