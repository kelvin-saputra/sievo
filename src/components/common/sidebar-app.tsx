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

interface SidebarAppProps extends React.ComponentProps<typeof Sidebar> {
  onLogout: () => Promise<void>;
}

export function SidebarApp({ onLogout, ...props }: SidebarAppProps) {
  return (
    <>
        <Sidebar collapsible="icon" {...props} >
        <SidebarHeader>
          <NavHeader />
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
        </SidebarContent>
        <SidebarFooter>
          <NavFooter onLogout={onLogout} />
        </SidebarFooter>
        </Sidebar>
    </>
  )
}
