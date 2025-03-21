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

interface ImportDataPlanningProps {
    onImportData: () => void
}

export function ImportDataModal({onImportData}: ImportDataPlanningProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
            <AiOutlineDownload />
            Import Budget Planning
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Apakah Anda yakin ingin import data dari planning?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onImportData()}
          >
            Import 
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
