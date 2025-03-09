"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { InventoryCategoryEnum } from "@/models/enums";
import { InventorySchema } from "@/models/schemas";
import useInventory from "@/hooks/use-inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InventoryCardProps {
  inventory: InventorySchema;
  onCategoryUpdate: (inventoryId: string, status: InventoryCategoryEnum) => void;
  onDeleteInventory: (inventoryId: string) => void;
}

const InventoryCard = ({
  inventory,
  onCategoryUpdate,
  onDeleteInventory,
}: InventoryCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [inventoryData, setInventoryData] = useState(inventory);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const {
    fetchAllInventories,
  } = useInventory();

  useEffect(() => {
    if (expanded) {
      fetchAllInventories();
    }
  }, [expanded, fetchAllInventories]);

  const handleStatusChange = (e: React.MouseEvent, status: InventoryCategoryEnum) => {
    e.stopPropagation();
    onCategoryUpdate(inventoryData.inventory_id, status);
    setInventoryData((prev) => ({ ...prev, status }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/inventory/${inventoryData.inventory_id}`);
  };

  return (
    <div className="mb-6 border rounded-lg shadow-md bg-white">
      <div
        className={`flex justify-between items-center ${
          inventoryData.category !== "CONSUMABLE" ? "bg-blue-200" : "bg-gray-200"
        } p-4 rounded-md cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-gray-800" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-800" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {inventoryData.item_name}
            </h3>
            <p className="text-gray-600 text-sm">
              {inventoryData.category} - {inventoryData.item_qty} items available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                {inventoryData.category} <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {InventoryCategoryEnum.options.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={(e) => handleStatusChange(e, status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="my-4">Are you sure you want to delete this inventory item?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onDeleteInventory(inventoryData.inventory_id);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryCard;
