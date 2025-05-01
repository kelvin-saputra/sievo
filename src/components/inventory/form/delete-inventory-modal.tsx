"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {Trash2 } from "lucide-react"


interface DeleteInventoryModalProps {
  inventoryId: string;
  onDeleteInventory: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DeleteInventoryModal({
  inventoryId,
  onDeleteInventory,
  open,
  setOpen,
}: DeleteInventoryModalProps) {
  const handleDelete = React.useCallback(() => {
    onDeleteInventory(inventoryId);
    setOpen(false);
  }, [inventoryId, onDeleteInventory, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="p-1 h-8 w-8" onClick={handleDeleteClick}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p>This action cannot be undone. This will permanently delete the item.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, delete item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
