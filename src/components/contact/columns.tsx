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
import { useState, useEffect } from "react";
import { UserSchema } from "@/models/schemas";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Pastikan file ini ada

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
      const [userRole, setUserRole] = useState<string>("");

      const meta = table.options.meta as { onDelete?: (contactId: string) => void };

      useEffect(() => {
        try {
          const userData = localStorage.getItem("authUser");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            const userParsed = UserSchema.partial().parse(parsedUser);
            setUserRole((userParsed.role || "").toUpperCase());
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }, []);

      const canDelete = ["ADMIN", "EXECUTIVE"].includes(userRole);

      const handleDelete = () => {
        if (meta.onDelete) {
          meta.onDelete(row.original.contact_id);
        }
        setShowDeleteDialog(false);
      };

      return (
        <>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/contact/${row.original.contact_id}`)}
            >
              Detail
            </Button>

            {canDelete && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </Button>
            )}
          </div>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus kontak &quot;{row.original.name}&quot;? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
