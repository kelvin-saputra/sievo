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

interface DeleteCategoryModalProps {
    onDeleteCategory: (categoryId: number, isActual: boolean) => void
    categoryId: number
    categoryName: string
    is_actual: boolean
    trigger: React.ReactNode
}

export function DeleteCategoryModal({onDeleteCategory, categoryId, categoryName, is_actual, trigger}: DeleteCategoryModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Category Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category {categoryName}? Deleted categories cannot be undone.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => onDeleteCategory(categoryId, is_actual)}
            className={`bg-destructive hover:bg-destructive/80`}
          >
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
