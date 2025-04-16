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
import { Trash } from "lucide-react"

interface DeleteActualItemModalProps {
    onDeleteActualItem: (budgetItemId: string) => void
    budgetItemId: string
}

export function DeleteActualBudgetItemModal({onDeleteActualItem, budgetItemId}: DeleteActualItemModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-gray-500 hover:text-desctructive hover:bg-red-50 transition-colors rounded-md p-1">
          <Trash size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Apakah Anda yakin ingin menghapus Item?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Item yang dihapus tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {onDeleteActualItem(budgetItemId);}}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
