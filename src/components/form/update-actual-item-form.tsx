"use client"
import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { UpdateActualBudgetItemDTO, type UpdatePurchaseDTO } from "@/models/dto"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InventorySchema, VendorServiceSchema } from "@/models/schemas"
import { Textarea } from "@/components/ui/textarea"
import type { ActualBudgetItemResponse } from "@/models/response/item-actual.response"

interface UpdateActualBudgetItemProps {
  onUpdateActualBudgetItem: (data: UpdateActualBudgetItemDTO) => void
  onUpdatePurchasing: (data: UpdatePurchaseDTO) => void
  categoryId: number
  inventories: InventorySchema[]
  vendorServices: VendorServiceSchema[]
  currentSource: string
  existingItem: ActualBudgetItemResponse
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

  // Extract item details based on source
  const getItemDetails = () => {
    if (currentSource === "other" && existingItem.other_item) {
      return {
        item_name: existingItem.other_item.item_name,
        description: existingItem.other_item.description,
        item_price: existingItem.other_item.item_price,
      }
    } else if (currentSource === "inventory" && existingItem.inventory) {
      return {
        item_name: existingItem.inventory.item_name,
        description: existingItem.inventory.description,
        item_price: existingItem.inventory.item_price,
      }
    } else if (currentSource === "vendor" && existingItem.vendor_service) {
      return {
        item_name: existingItem.vendor_service.service_name,
        description: existingItem.vendor_service.description,
        item_price: existingItem.vendor_service.price,
      }
    }
    return { item_name: "", description: "", item_price: 0 }
  }

  const itemDetails = getItemDetails()

  const form = useForm<UpdateActualBudgetItemDTO>({
    resolver: zodResolver(UpdateActualBudgetItemDTO),
    defaultValues: {
      actual_budget_item_id: existingItem.actual_budget_item_id,
      item_subtotal: existingItem.item_subtotal,
      item_qty: existingItem.item_qty,
      category_id: categoryId,
      source: currentSource,
      item_name: itemDetails.item_name || "",
      description: itemDetails.description || "",
      item_price: itemDetails.item_price || 0,
      inventory_id: existingItem.inventory_id || undefined,
      vendor_service_id: existingItem.vendor_service_id || undefined,
      other_item_id: existingItem.other_item_id || undefined,
    },
  })

  const onSubmit = async (data: UpdateActualBudgetItemDTO) => {
    console.log("Submitting form:", data)
    const { source, ...dataUpdate } = data

    try {
      // Validate based on source
      if (source === "inventory" && !dataUpdate.inventory_id) {
        form.setError("inventory_id", { message: "Please select an inventory item" })
        return
      }
      if (source === "vendor" && !dataUpdate.vendor_service_id) {
        form.setError("vendor_service_id", { message: "Please select a vendor service" })
        return
      }

      if (source === "other") {
        // Validate other item fields
        if (!dataUpdate.item_name) {
          form.setError("item_name", { message: "Item name is required" })
          return
        }
        if (!dataUpdate.item_price || dataUpdate.item_price <= 0) {
          form.setError("item_price", { message: "Item price must be greater than 0" })
          return
        }

        const { item_name, item_price, description, created_by, ...actualBudgetData } = dataUpdate

        // Update purchase data first
        const purchaseData: UpdatePurchaseDTO = {
          other_item_id: dataUpdate.other_item_id,
          item_name: item_name,
          item_price: item_price,
          description: description || "",
          updated_by: created_by || "",
        }

        console.log("Updating purchase item:", purchaseData)
        await onUpdatePurchasing(purchaseData)

        // Then update budget item
        console.log("Updating budget item:", actualBudgetData)
        await onUpdateActualBudgetItem(actualBudgetData)

        toast.success("Item updated successfully")
      } else {
        // For inventory or vendor sources
        const { item_name, item_price, description, created_by, ...actualBudgetData } = dataUpdate
        if (item_name || item_price || description || created_by) {
          form.reset({ item_name: "", item_price: 0, description: "", created_by: "" })
        }

        console.log("Updating budget item:", actualBudgetData)
        await onUpdateActualBudgetItem(actualBudgetData)

        toast.success("Item updated successfully")
      }

      setOpen(false)
    } catch (error) {
      console.error("Error updating form:", error)
      toast.error("Failed to update budget item")
    }
  }

  const selectedSource = form.watch("source")
  const selectedInventoryId = form.watch("inventory_id")
  const selectedVendorServiceId = form.watch("vendor_service_id")
  const quantity = form.watch("item_qty")
  const otherItemPrice = form.watch("item_price")

  // Reset fields when source changes
  useEffect(() => {
    if (selectedSource !== currentSource) {
      // Source has changed, reset relevant fields
      form.setValue("inventory_id", undefined)
      form.setValue("vendor_service_id", undefined)

      if (selectedSource === "other") {
        // Keep other fields if switching to "other"
        form.setValue("item_name", "")
        form.setValue("description", "")
        form.setValue("item_price", 0)
      } else {
        // Clear other fields if switching to inventory or vendor
        form.setValue("item_name", "")
        form.setValue("description", "")
        form.setValue("item_price", 0)
      }

      // Reset subtotal when changing source
      form.setValue("item_subtotal", 0)
    }
  }, [selectedSource, form, currentSource])

  // Update price and subtotal when selections change
  useEffect(() => {
    let price = 0

    if (selectedSource === "inventory" && selectedInventoryId) {
      const item = inventories.find((item) => item.inventory_id === selectedInventoryId)
      if (item) {
        price = item.item_price
        form.setValue("item_name", item.item_name)
        form.setValue("description", item.description || "")
      }
    } else if (selectedSource === "vendor" && selectedVendorServiceId) {
      const service = vendorServices.find((service) => service.service_id === selectedVendorServiceId)
      if (service) {
        price = service.price
        form.setValue("item_name", service.service_name)
        form.setValue("description", service.description || "")
      }
    } else if (selectedSource === "other") {
      price = otherItemPrice || 0
    }

    // Only update item_price if it's not "other" source (since user sets that manually)
    if (selectedSource !== "other") {
      form.setValue("item_price", price)
    }

    // Always update subtotal
    const currentQty = quantity || 0
    const currentPrice = price || 0
    form.setValue("item_subtotal", currentPrice * currentQty)
  }, [
    selectedSource,
    selectedInventoryId,
    selectedVendorServiceId,
    otherItemPrice,
    quantity,
    form,
    inventories,
    vendorServices,
  ])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-gray-500 hover:text-blue-matahati hover:bg-blue-50 transition-colors rounded-md px-3 py-1 text-sm border border-gray-200">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="update-item-plan-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
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
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inventory item" />
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
              <FormField
                control={form.control}
                name="vendor_service_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Service</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendorServices.map((service) => (
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
            )}
            {selectedSource === "other" && (
              <>
                <FormField
                  control={form.control}
                  name="item_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
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
                      <FormLabel>Item Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter item price"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                        <Textarea placeholder="Enter item description" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="item_qty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button type="submit" form="update-item-plan-form">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}