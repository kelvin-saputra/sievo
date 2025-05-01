import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TaskSchema } from "@/models/schemas";
import { UserWithStatus } from "@/hooks/use-hr"; // <-- import your user type
import { taskStatusColorMap } from "@/utils/eventStatusColorMap";

export const taskColumns = (
  users: UserWithStatus[]
): ColumnDef<TaskSchema>[] => [
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
    cell: ({ row }) => {
      const assignedId = row.original.assigned_id;
      const user = users.find((u) => u.id === assignedId);
      return user?.name || user?.email || "Unassigned";
    },
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
      <Badge className={taskStatusColorMap[row.original.status]}>
        {row.original.status}
      </Badge>
    ),

    enableSorting: false,
  },
];
