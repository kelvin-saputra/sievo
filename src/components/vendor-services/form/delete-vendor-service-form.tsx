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
import { VendorServiceSchema } from "@/models/schemas"

interface DeleteVendorServiceModalProps {
    onDeleteVendorServices: (serviceId: string) => Promise<void>
    serviceId: string
    existingVendor: VendorServiceSchema
    trigger: React.ReactNode
}

export function DeleteVendorServiceForm({onDeleteVendorServices, serviceId, existingVendor, trigger}: DeleteVendorServiceModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Apakah Anda yakin ingin menghapus vendor service {existingVendor.service_name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Vendor Service yang dihapus tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          
          <AlertDialogAction
            onClick={() => {
              onDeleteVendorServices(serviceId);
              window.location.replace("/vendor-service")
            }}
          >
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
