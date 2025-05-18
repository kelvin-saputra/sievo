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

interface DeletePlanItemModalProps {
    onDeleteItemPlan: (budgetItemId: string) => void
    budgetItemId: string
}

export function DeleteBudgetPlanItemModal({onDeleteItemPlan, budgetItemId}: DeletePlanItemModalProps) {
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
            Apakah Anda yakin ingin menghapus Item Perencanaan Anggaran?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Item yang dihapus tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          
          <AlertDialogAction className="bg-destructive hover:bg-destructive/80"
            onClick={() => {onDeleteItemPlan(budgetItemId);}}
          >
            Hapus
          </AlertDialogAction>
          <AlertDialogCancel>Batal</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
