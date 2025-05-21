"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquareArrowOutUpRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InventorySchema } from "@/models/schemas/inventory";
import { useRouter } from "next/navigation"; 
import { EditInventoryModal } from "@/components/inventory/form/edit-inventory-modal";
import { DeleteInventoryModal } from "@/components/inventory/form/delete-inventory-modal";
import useInventory from "@/hooks/use-inventory";
import { useState } from "react";
import { ADMINEXECUTIVE, ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";


const InventoryActions = ({ inventory }: { inventory: InventorySchema }) => {
  const router = useRouter();
  const {handleDeleteInventory, handleUpdateInventory } = useInventory(); 
  const [open, setOpen] = useState(false);

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="p-1 h-8 w-8"
        onClick={() => router.push(`/inventory/${inventory.inventory_id}`)}
      >
        <SquareArrowOutUpRight className="h-4 w-4" />
      </Button>
      {checkRoleClient(ADMINEXECUTIVEINTERNAL) && (
        <EditInventoryModal inventory={inventory} onUpdateInventory={handleUpdateInventory} open={open} setOpen={setOpen} />
      )}

      {checkRoleClient(ADMINEXECUTIVE) && (
        <DeleteInventoryModal 
          inventoryId={inventory.inventory_id} 
          onDeleteInventory={async (itemId) => {
            try {
              await handleDeleteInventory(itemId);
              console.log(itemId)
              router.push("/inventory"); 
            } catch (error) {
              console.error(error);
            }
          }}
          open={open} 
          setOpen={setOpen} 
        />
      )}
    </div>
  );
};

export const inventoryColumns: ColumnDef<InventorySchema, unknown>[] = [
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
    accessorKey: "inventory_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "item_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Item Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "item_qty",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
       Total Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "item_price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = Number(row.getValue("item_price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "is_avail",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className={row.original.is_avail ? "text-green-600" : "text-red-600"}>
        {row.original.is_avail ? "Available" : "Unavailable"}
      </span>
    ),
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
    cell: ({ row }) => <InventoryActions inventory={row.original} />, 
  },
];
