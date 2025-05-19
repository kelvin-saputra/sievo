"use client"
import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { UpdateActualBudgetItemDTO, type UpdatePurchaseDTO } from "@/models/dto"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PurchasingSchema, type InventorySchema, type VendorServiceSchema } from "@/models/schemas"
import { Textarea } from "@/components/ui/textarea"
import { BudgetItemActual } from "@/models/response/actual-item"
import { Pencil } from "lucide-react"
import { VendorWithService } from "@/models/response/vendor-with-service"

interface UpdateActualBudgetItemProps {
  onUpdateActualBudgetItem: (data: UpdateActualBudgetItemDTO) => Promise<void>
  onUpdatePurchasing: (data: UpdatePurchaseDTO) => Promise<void>
  categoryId: number
  inventories: InventorySchema[]
  vendorServices: VendorWithService[]
  currentSource: string
  existingItem: BudgetItemActual
}

export function UpdateActualBudgetItemForm({
  onUpdateActualBudgetItem,
  onUpdatePurchasing,
  categoryId,
  inventories,
  vendorServices,
  currentSource,
  existingItem,
}: UpdateActualBudgetItemProps) {
  const [open, setOpen] = useState(false)
  const [selectedVendorService, setSelectedVendorService] = useState<VendorServiceSchema[]>([])
  const [selectedInventory, setSelectedInventory] = useState<InventorySchema | null>(null)

  let item_name, description, item_price;
  if (currentSource === "other") {
    item_name = existingItem.other_item?.item_name
    description = existingItem.other_item?.description
    item_price = existingItem.other_item?.item_price
  }
  if (currentSource === "inventory") {
    item_name = existingItem.inventory?.item_name
    item_price = existingItem.inventory?.item_price
    description = existingItem.inventory?.description
  }
  if (currentSource === "vendor") {
    item_name = existingItem.vendor_service?.service_name
    item_price = existingItem.vendor_service?.price
    description = existingItem.vendor_service?.description
  }

  const form = useForm<UpdateActualBudgetItemDTO>({
    resolver: zodResolver(UpdateActualBudgetItemDTO),
    defaultValues: {
      actual_budget_item_id: existingItem.actual_budget_item_id,
      item_subtotal: existingItem.item_subtotal,
      item_qty: existingItem.item_qty,
      category_id: categoryId,
      source: currentSource,
      item_name: item_name || "",
      description: description || "",
      item_price: item_price || 0,
      inventory_id: existingItem.inventory_id || undefined,
      vendor_id: existingItem.vendor_service?.vendor_id,
      vendor_service_id: existingItem.vendor_service_id || (existingItem.vendor_service_id ? selectedVendorService.find(service => service.service_id === existingItem.vendor_service_id)?.service_id : undefined),
      other_item_id: existingItem.other_item_id || undefined,
    },
  })

  const onSubmit = async (data: UpdateActualBudgetItemDTO) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { source, vendor_id, ...dataUpdate } = data

    try {
      if (source === "inventory" && !dataUpdate.inventory_id) {
        form.setError("inventory_id", { message: "Please select an inventory item" })
        return
      }
      if (source === "inventory" && (dataUpdate.item_qty || 0) > ((selectedInventory?.item_qty || 0)-(selectedInventory?.item_qty_damaged || 0)-(selectedInventory?.item_qty_reserved || 0) - (quantity || 0) + (existingItem.inventory_id === selectedInventory?.inventory_id? existingItem.item_qty:0))) {
        form.setError("item_qty", { message: "Reserved Inventory cannot more than available inventory" })
        return
      }
      if (source === "vendor" && !dataUpdate.vendor_service_id) {
        form.setError("vendor_service_id", { message: "Please select a vendor service" })
        return
      }

      if (source === "other") {
        if (!dataUpdate.item_name) {
          form.setError("item_name", { message: "Item name is required" })
          return
        }
        if (!dataUpdate.item_price || dataUpdate.item_price <= 0) {
          form.setError("item_price", { message: "Item price must be greater than 0" })
          return
        }

        const { item_name, item_price, description, created_by, ...actualBudgetData } = dataUpdate

        const purchaseData: UpdatePurchaseDTO = {
          other_item_id: dataUpdate.other_item_id,
          item_name: item_name,
          item_price: item_price,
          description: description || "",
          updated_by: created_by || "",
        }

        const updatedPurchase = await onUpdatePurchasing(purchaseData)
        actualBudgetData.other_item_id = PurchasingSchema.parse(updatedPurchase).other_item_id
        await onUpdateActualBudgetItem(actualBudgetData)

        toast.success("Item updated successfully")
      } else {
        const { item_name, item_price, description, created_by, ...actualBudgetData } = dataUpdate
        
        if (item_name || item_price || description || created_by) {
          form.reset({ item_name: "", item_price: 0, description: "", created_by: "" })
        }

        await onUpdateActualBudgetItem(actualBudgetData)
      }
      form.reset()
      setOpen(false)
    } finally {
    }
  }

  const selectedVendor = form.watch("vendor_id")
  const selectedSource = form.watch("source")
  const selectedInventoryId = form.watch("inventory_id")
  const selectedVendorServiceId = form.watch("vendor_service_id")
  const quantity = form.watch("item_qty")
  const otherItemPrice = form.watch("item_price")

  useEffect(() => {
    if (selectedSource) {
      if (selectedSource === "other" && selectedSource === currentSource) {
        form.setValue("item_name", existingItem.other_item?.item_name)
        form.setValue("description", existingItem.other_item?.description)
        form.setValue("item_price", existingItem.other_item?.item_price)
        form.setValue("item_subtotal", existingItem.item_subtotal)
      } else {
        form.setValue("item_name", "")
        form.setValue("description", "")
        form.setValue("item_price", 0)
      }
      form.setValue("item_subtotal", 0)
    }
  }, [selectedSource, form, currentSource, existingItem.other_item?.item_name, existingItem.other_item?.description, existingItem.other_item?.item_price, existingItem.item_subtotal])

  useEffect(() => {
    let price = 0

    if (selectedSource === "inventory" && selectedInventoryId) {
      const item = inventories.find((item) => item.inventory_id === selectedInventoryId)
      if (item) {
        price = item.item_price
        setSelectedInventory(item)
        form.setValue("item_name", item.item_name)
        form.setValue("description", item.description || "")
      }
    } else if (selectedSource === "vendor" && selectedVendorServiceId) {
      const service = selectedVendorService.find((service) => service.service_id === selectedVendorServiceId)
      if (service) {
        price = service.price
        form.setValue("item_name", service.service_name)
        form.setValue("description", service.description || "")
      }
    } else if (selectedSource === "other") {
      price = otherItemPrice || 0
    }

    if (selectedSource !== "other") {
      form.setValue("item_price", price)
    }

    const currentQty = quantity || 0
    const currentPrice = price || 0
    form.setValue("item_subtotal", currentPrice * currentQty)
  }, [selectedSource, selectedInventoryId, selectedVendorServiceId, otherItemPrice, quantity, form, inventories, vendorServices, selectedVendorService])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  useEffect(() => {
    if (selectedVendor) {
      const selectedVendorEntity = vendorServices.find(vs => vs.vendor_id === selectedVendor)
      const selectedVendorServiceByVendor = selectedVendorEntity?.vendor_service || []
      setSelectedVendorService(selectedVendorServiceByVendor)
    }
  }, [selectedVendor, vendorServices])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="text-gray-500 hover:text-blue-matahati hover:bg-blue-50 transition-colors rounded-md p-1">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Budget Actual Item</DialogTitle>
          <DialogDescription>Change data that you want to change to update your budget actual item</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="update-actual-item-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Source</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Budget Item Source..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedSource === "inventory" && (
              <FormField
                control={form.control}
                name="inventory_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory Item</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select the Inventory Item..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inventories.map((item) => (
                          <SelectItem key={item.inventory_id} value={item.inventory_id}>
                            {item.item_name} - {formatCurrency(item.item_price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {selectedSource === "vendor" && (
              <>
                <FormField
                  control={form.control}
                  name="vendor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the Vendor..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vendorServices.map((vendor) => (
                            <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                              {vendor.contact.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vendor_service_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Service</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select the Vendor Service Item..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedVendorService.map((service) => (
                            <SelectItem key={service.service_id} value={service.service_id}>
                              {service.service_name} - {formatCurrency(service.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {selectedSource === "other" && (
              <>
                <FormField
                  control={form.control}
                  name="item_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the budget item name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="item_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Item Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter the budget item price..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the budget item description..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className={`${selectedSource === "inventory" ? "flex justify-between gap-6":""}`}>
              <div className={`${selectedSource === "inventory"?"w-1/2":""}`}>
                <FormField
                  control={form.control}
                  name="item_qty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                      {selectedSource === "inventory"? (
                        <Input type="number" min="1" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                      ): (
                        <Input type="number" min="1" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>

                      )}

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {selectedSource === "inventory" && (
                <div className="w-1/2">
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value= {(selectedInventory?.item_qty || 0)-(selectedInventory?.item_qty_damaged || 0)-(selectedInventory?.item_qty_reserved || 0) - (quantity || 0) + (existingItem.inventory_id === selectedInventory?.inventory_id? existingItem.item_qty:0)}
                        disabled
                        className="bg-gray-50 text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
                  )}
            </div>
            <FormField
              control={form.control}
              name="item_subtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={formatCurrency((field.value as number) || 0)}
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="update-actual-item-form">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}