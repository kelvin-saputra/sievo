import {
  Users,
  CalendarDays,
  LayoutDashboard,
  Boxes,
  Phone,
  FileEdit,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Human Resources",
      url: "/human-resources",
      icon: Users,
      roles: ["ADMIN", "EXECUTIVE"],
    },
    {
      title: "Event",
      url: "/events",
      icon: CalendarDays,
      roles: ["ADMIN", "EXECUTIVE", "INTERNAL", "FREELANCE"],
    },
    {
      title: "General Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "EXECUTIVE"],
    },
    {
      title: "Proposal",
      url: "/proposal",
      icon: FileEdit,
      roles: ["ADMIN", "EXECUTIVE", "INTERNAL"],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Boxes,
      roles: ["ADMIN"],
    },
    {
      title: "Contact",
      url: "/contact",
      icon: Phone,
      roles: ["ADMIN", "EXECUTIVE", "INTERNAL", "FREELANCE"],
    },
  ],
};
