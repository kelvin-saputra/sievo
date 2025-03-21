"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/shadUtils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ChevronDownIcon } from "lucide-react";

const tabs = [
  { name: "Overview", path: "" },
  { name: "Budget", path: "plan" },
  { name: "Preparation", path: "prep" },
  { name: "Implementation", path: "impl" },
  { name: "Report", path: "report" },
];

export default function NavigationTabs() {
  const { event_id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(`/events/${event_id}/${path ? `${path}` : ""}`);
  };

  return (
    <div className="relative flex gap-4">
      <NavigationMenu className="max-w-full w-full justify-start">
      <NavigationMenuList className="space-x-2">
        {tabs.map((tab) => {
        const isActive =
          pathname === `/events/${event_id}${tab.path ? `/${tab.path}` : ""}`;
          
          return(
            <NavigationMenuItem key={tab.name} >
            <NavigationMenuTrigger
              className={cn(
              "px-6 py-4 text-sm font-medium whitespace-nowrap",
              isActive ? "text-primary bg-accent" : "text-muted-foreground",
              )}
              onClick={() => handleNavigation(tab.path)}
            >
              {tab.name}
              <ChevronDownIcon
              className={cn(
                "relative top-[1px] ml-1 size-3 transition duration-300",
                isActive ? "" : "rotate-180"
              )}
              aria-hidden="true"
              />
            </NavigationMenuTrigger>
            </NavigationMenuItem>
        )})}
      </NavigationMenuList>
    </NavigationMenu>
    </div>
  );
}
