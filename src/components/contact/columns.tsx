"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export interface Contact {
  contact_id: string;
  name: string;
  email: string;
  phone_number: string;
  description?: string | null;
  created_by: string;
  updated_by?: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export type ContactWithRole = Contact & {
  role: "none" | "client" | "vendor";
};


export const contactColumns: ColumnDef<ContactWithRole, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Phone Number <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge 
          className={
            role === "client" 
              ? "bg-green-100 text-green-800 hover:bg-blue-200" 
              : role === "vendor" 
                ? "bg-orange-100 text-orange-800 hover:bg-purple-200" 
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }
        >
          {role === "client" 
            ? "Client" 
            : role === "vendor" 
              ? "Vendor" 
              : "None"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string);
      return <div>{date.toLocaleDateString("id-ID")}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: function ActionCell({ row }) {
      const router = useRouter();
      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/contact/${row.original.contact_id}`)}
          >
            Detail
          </Button>
          <Button
            variant="destructive"
            onClick={() => console.log("Delete", row.original.contact_id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];