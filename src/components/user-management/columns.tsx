"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserSchema } from "@/models/schemas";
import type { DeleteUserDTO } from "@/models/dto/user.dto";
import { ActionCell } from "./action-cell";

interface ColumnsProps {
  onDeleteUser: (data: DeleteUserDTO) => Promise<void>;
}

export const createColumns = ({
  onDeleteUser,
}: ColumnsProps): ColumnDef<UserSchema>[] => [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div>
        <div className="font-medium textsm">{row.getValue("email")}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.phone_number}
        </div>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-muted p-2">
          <User className="h-4 w-4" />
        </div>
        <span>{row.getValue("name")}</span>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      return <Badge>{role}</Badge>;
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("is_active");

      return (
        <Badge
          className={
            status === true
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600"
          }
        >
          {status === true ? "ACTIVE" : "INACTIVE"}
        </Badge>
      );
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "started_at",
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.getValue("started_at");

      if (!date) return "-";

      const dateObj = new Date(date as string);
      if (isNaN(dateObj.getTime())) return date; // Return original if invalid date

      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}` === "01/01/1970"
        ? "-"
        : `${day}/${month}/${year}`;
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "ended_at",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.getValue("ended_at");

      const dateObj = new Date(date as string);
      if (isNaN(dateObj.getTime())) return date; // Return original if invalid date

      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}` === "01/01/1970"
        ? "-"
        : `${day}/${month}/${year}`;
    },
    sortingFn: "datetime",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ActionCell user={row.original} onDeleteUser={onDeleteUser} />;
    },
  },
];
