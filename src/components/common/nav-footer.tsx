"use client"

import { useState } from "react"
import Link from "next/link"
import { BadgeCheck, ChevronsUpDown, LogOut, Settings } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { UserSchema } from "@/models/schemas"

export function NavFooter({
  user,
  onLogout = () => console.log('Logging out...')
}: {
  user: UserSchema
  onLogout?: () => void
}) {
  const { isMobile } = useSidebar()
  const [isOpen, setIsOpen] = useState(false)

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    const nameParts = name.split(' ')
    return nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : nameParts[0][0].toUpperCase()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group transition-colors duration-200 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer"
            >
              <Avatar className="h-9 w-9 rounded-lg border border-border/50 transition-all duration-200 group-hover:border-border">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className={`ml-auto size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-3 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg border border-border/50">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex w-full cursor-pointer items-center">
                    <BadgeCheck className="mr-2 size-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
              {user.is_admin === true && (
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex w-full cursor-pointer items-center">
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
