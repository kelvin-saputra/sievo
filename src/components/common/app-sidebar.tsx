import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Calendar, Users, Settings } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <span className="ml-2 text-lg font-bold">SIEVO</span>
      </SidebarHeader>
      <SidebarContent>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/events"
            className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded"
          >
            <Calendar size={20} />
            <span>Events</span>
          </Link>
          <Link
            href="/clients"
            className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded"
          >
            <Users size={20} />
            <span>Clients</span>
          </Link>
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <Link
          href="/settings"
          className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
