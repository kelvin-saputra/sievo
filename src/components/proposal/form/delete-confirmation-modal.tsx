"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  proposalName: string
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Are you sure you want to delete this Proposal?</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
          This action cannot be undone. The proposal will be permanently removed from the system.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="border-gray-300">
            Cancel
          </Button>
          <Button variant = "destructive"onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
