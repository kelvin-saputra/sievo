"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TaskSchema } from "@/models/schemas";

const statusColors: Record<TaskSchema["status"], string> = {
  PENDING: "bg-yellow-500 text-white",
  ON_PROGRESS: "bg-blue-500 text-white",
  DONE: "bg-green-500 text-white",
  CANCELLED: "bg-gray-500 text-white",
};

export const taskColumns: ColumnDef<TaskSchema>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left w-full justify-start"
      >
        Task Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "assigned_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left w-full justify-start"
      >
        Assigned To
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.assigned_id || "Unassigned",
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left w-full justify-start"
      >
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.due_date
        ? new Date(row.original.due_date).toLocaleDateString()
        : "N/A",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left w-full justify-start"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge className={statusColors[row.original.status]}>
        {row.original.status}
      </Badge>
    ),

    enableSorting: false,
  },
];
