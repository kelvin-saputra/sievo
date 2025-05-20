"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ADMINEXECUTIVE, checkRoleClient } from "@/lib/rbac-client";

export interface Contact {
  contact_id: string;
  name: string;
  email: string;
  phone_number: string;
  description?: string | null;
  address: string;
  created_by: string;
  updated_by?: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export type ContactWithRole = Contact & {
  role: "none" | "client" | "vendor";
  client?: {
    type: string;
  } | null;
  vendor?: {
    type: string;
  } | null;
};

// Helper function to format enum values to human-readable text
const formatEnumValue = (value: string): string => {
  if (!value) return "N/A";
  
  // Split by underscores and convert to title case
  return value
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const contactColumns: ColumnDef<ContactWithRole, unknown>[] = [
  {
    id: "avatar",
    header: " ",
    cell: ({ row }) => {
      const name = row.original.name;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
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
    accessorKey: "address",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Address <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      // Truncate address if it's too long
      return <div title={address}>{address.length > 30 ? `${address.substring(0, 27)}...` : address}</div>;
    },
  },
  {
    id: "type",
    header: () => (
      <Button
        variant="ghost"
      >
        Type
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      let type = "N/A";
      
      if (role === "client" && row.original.client?.type) {
        type = formatEnumValue(row.original.client.type);
      } else if (role === "vendor" && row.original.vendor?.type) {
        type = formatEnumValue(row.original.vendor.type);
      }
      
      return (
        <div>
          {type}
        </div>
      );
    },
    enableSorting: false,
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
    cell: function ActionCell({ row, table }) {
      const router = useRouter();
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      const meta = table.options.meta as { onDelete?: (contactId: string) => void };

      const handleDelete = () => {
        if (meta.onDelete) {
          meta.onDelete(row.original.contact_id);
        }
        setShowDeleteDialog(false);
      };

      return (
        <>
          <div className="flex space-x-2 whitespace-nowrap">
            <Button
              variant="outline"
              onClick={() => router.push(`/contact/${row.original.contact_id}`)}
              className="px-3"
            >
              Detail
            </Button>

            {checkRoleClient(ADMINEXECUTIVE) && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="px-3"
              >
                Delete
              </Button>
            )}
          </div>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete &quot;{row.original.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action can not be undone. This will permanently delete the contact.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
