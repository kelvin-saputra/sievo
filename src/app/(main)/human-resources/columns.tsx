"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export type User = {
  id: string
  name: string
  role: string
  status: "available" | "inactive" | "on work"
  avatar?: string
}

export const hrColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} alt={row.getValue("name")} />
            <AvatarFallback>{(row.getValue("name") as string).charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{row.getValue("name")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Role <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toLowerCase();
      let colorClass = "bg-gray-100 text-gray-800"; // Default color
  
      if (status === "available") {
        colorClass = "bg-green-100 text-green-800";
      } else if (status === "on work") {
        colorClass = "bg-yellow-100 text-yellow-800";
      } else if (status === "inactive") {
        colorClass = "bg-gray-100 text-gray-800";
      }
  
      return <Badge variant="secondary" className={colorClass}>{status}</Badge>;
    },
  },  
  {
    id: "actions",
    cell: () => {
      return (
        <Button variant="default" size="sm">
          Assign to
        </Button>
      )
    },
  },
]

