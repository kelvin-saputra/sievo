"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserSchema } from "@/models/schemas";
import { data } from "@/components/common/sidebar-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({ user }: { user: UserSchema }) {
  const pathName = usePathname();
  const userRole = user.role;
  const userAdmin = user.is_admin;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.navMain.map(
          (item) =>
            (item.roles.includes(userRole) || userAdmin) && (
              <Link key={item.title} href={item.url}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`group flex items-center hover:cursor-pointer ${
                      pathName.split("/")[1].toLowerCase() ===
                      item.url.split("/")[1].toLowerCase()
                        ? "bg-yellow-matahati"
                        : ""
                    }`}
                  >
                    {item.icon && (
                      <item.icon className="w-5 h-5 mr-2 text-[--color-sidebar-primary-foreground] group-hover:text-[--color-sidebar-accent-foreground] transition-colors duration-200" />
                    )}
                    <span className="text-[--color-sidebar-primary-foreground] group-hover:text-[--color-sidebar-accent-foreground] transition-colors duration-200">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
