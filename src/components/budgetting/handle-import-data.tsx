"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AiOutlineDownload } from "react-icons/ai"
import { Button } from "../ui/button"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"

interface ImportDataPlanningProps {
    onImportData: () => void
}

export function ImportDataModal({onImportData}: ImportDataPlanningProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
            <AiOutlineDownload />
            Import Budget
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Import Budget Planning Data</AlertDialogTitle>
            <AlertDialogDescription>
              This action will add all budget item from planning into your current budget data. Are you sure you want to continue?
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onImportData()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
