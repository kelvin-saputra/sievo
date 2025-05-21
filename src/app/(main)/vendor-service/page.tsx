"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { columns } from "@/components/vendor-services/columns"
import { DataTable } from "@/components/vendor-services/data-table"
import { useSafeContext } from "@/hooks/use-safe-context"
import VendorServiceContext from "@/models/context/vendor-service-context"
import { Plus } from "lucide-react"
import { AddVendorServiceForm } from "@/components/vendor-services/form/add-vendor-service-form"
import { Button } from "@/components/ui/button"

export default function VendorServicePage() {
  const [selectedVendorId, setSelectedVendorId] = useState<string>("all")
  const [globalFilter, setGlobalFilter] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  const {
    vendorServices,
    handleAddVendorService,
  } = useSafeContext(VendorServiceContext, "VendorServiceContext");

  const filteredDataRaw =
    selectedVendorId === "all"
    ? vendorServices
    : vendorServices.filter((service) => service.vendor_id === selectedVendorId)

  const filteredData = filteredDataRaw.flatMap((vs) =>
    vs.vendor_service.map((svc) => ({
      vendor_id: vs.vendor_id,
      contact_id: vs.contact_id,
      bankAccountDetail: vs.bankAccountDetail,
      vendor_name: vs.contact.name,
      service_id: svc.service_id,
      service_name: svc.service_name,
      category: svc.category,
      price: svc.price,
      rating: svc.rating,
      description: svc.description,
      is_deleted: svc.is_deleted
    }))
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div>
        <Button variant={"default"} className="mb-4" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2" /> Add Vendor Services
        </Button>
        <AddVendorServiceForm
          open={isOpen}
          onOpenChange={setIsOpen}
          onAddVendorService={handleAddVendorService}
        />
      </div>
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-2">Filter by Vendor:</label>
              <Select value={selectedVendorId} onValueChange={(value) => setSelectedVendorId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendorServices.map((vendor) => (
                    <SelectItem key={vendor.vendor_id} value={vendor.vendor_id.toString()}>
                      {vendor.contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-2/3">
              <label className="block text-sm font-medium mb-2">Search:</label>
              <Input
                placeholder="Search Vendor Service, Category, Price, and Vendor..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <DataTable columns={columns} data={filteredData} globalFilter={globalFilter} />
        </CardContent>
      </Card>
    </div>
  )
}
