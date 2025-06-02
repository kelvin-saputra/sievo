"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

interface DeleteActualItemModalProps {
    onDeleteActualItem: (budgetItemId: string) => void
    budgetItemId: string
}

export function DeleteActualBudgetItemModal({onDeleteActualItem, budgetItemId}: DeleteActualItemModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md p-1">
          <Trash size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Delete Budget Actual Item
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this Budget Actual Item? Deleted items cannot be undoned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80"
            onClick={() => {onDeleteActualItem(budgetItemId);}}
          >
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
