"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/shadUtils";
import { motion } from "framer-motion";

const tabs = [
  { name: "Overview", path: "" },
  { name: "Budget", path: "budget" },
  { name: "Preparation", path: "prep" },
  { name: "Implementation", path: "impl" },
  { name: "Report", path: "report" },
];

export default function NavigationTabs() {
  const { event_id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(`/events/${event_id}/${path ? `${path}/` : ""}`);
  };

  return (
    <div className="relative flex gap-4 border-b pb-2">
      {tabs.map((tab) => {
        const isActive =
          pathname === `/events/${event_id}/${tab.path ? `${tab.path}/` : ""}`;

        return (
          <button
            key={tab.path}
            onClick={() => handleNavigation(tab.path)}
            className={cn(
              "relative px-4 py-2 text-gray-600 transition-all duration-300 hover:text-blue-600",
              isActive && "text-blue-600 font-semibold"
            )}
          >
            {tab.name}
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute left-0 bottom-0 w-full h-1 bg-blue-600 rounded-md"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
