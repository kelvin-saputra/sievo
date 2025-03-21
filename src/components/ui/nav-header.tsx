"use client"

import * as React from "react"
import { SidebarGroup, useSidebar } from "@/components/ui/sidebar"


import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Image from "next/image"
import { SearchForm } from "../common/search-form"
import Link from "next/link"
import { FaHouse } from "react-icons/fa6"
import { usePathname } from "next/navigation"

export function NavHeader() {
  const { state } = useSidebar();
  const pathName = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem key={"SI EVO"}>
          <SidebarMenuButton
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar"
            tooltip={"SIEVO"}
          >
              <Image src={"/sidebar-logo.png"} alt={"Side Bar Logo"} width={42} height={32.25} className="mix-blend-multiply"/>
              <div className="grid flex-1 text-left text-sm leading-tight">
                  <p className="text-xl font-extrabold ml-4 mt-1">SIEVO</p>
              </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
          {state === "expanded" && <SearchForm className="mt-4 mb-2"/>}
        <SidebarMenuItem key={"Home"}>
          <Link href={"/"}>
            <SidebarMenuButton
              className={`group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer ${pathName.split('/')[1].toLowerCase() === "" ? 'bg-yellow-matahati' : ''}`}
              tooltip={"Home"}
            >
              <FaHouse className="mr-2 text-sm font-medium text-sidebar-secondary-foreground"/>
              <span>Home</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
