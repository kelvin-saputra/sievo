"use client"

import { useSafeContext } from "@/hooks/use-safe-context";
import VendorServiceContext from "@/models/context/vendor-service-context";
import { VendorServiceSchema } from "@/models/schemas";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { UpdateVendorServiceForm } from "./form/update-vendor-service-form";
import { DeleteVendorServiceForm } from "./form/delete-vendor-service-form";
import { ADMINEXECUTIVE, ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";

export const VendorServiceActions = ({ vendor_service }: { vendor_service: VendorServiceSchema }) => {
  const {
		handleUpdateVendorService,
		handleDeleteVendorService
	} = useSafeContext(VendorServiceContext, "VendorServiceContext")
	const router = useRouter();
  const [isUpdateForm, setUpdateForm] = useState(false);

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="p-1 h-8 w-8"
        onClick={() => router.push(`/vendor-service/${vendor_service.vendor_id}/${vendor_service.service_id}`)}
      >
        <SquareArrowOutUpRight className="h-4 w-4" />
      </Button>
      {checkRoleClient(ADMINEXECUTIVEINTERNAL) && (
        <Button variant="outline" size="icon" className="p-1 h-8 w-8" onClick={() => setUpdateForm(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
        <UpdateVendorServiceForm existingVendorService={vendor_service} onUpdateVendorService={handleUpdateVendorService} open={isUpdateForm} onOpenChange={setUpdateForm} />

      {checkRoleClient(ADMINEXECUTIVE) && (
        <DeleteVendorServiceForm
          serviceId={vendor_service.service_id} 
          onDeleteVendorServices={handleDeleteVendorService}
          existingVendor={vendor_service}
          trigger={(
          <Button variant="destructive" size="icon" className="p-1 h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
          )}
        />
      )}
    </div>
  );
};