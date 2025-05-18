"use client"

import type * as React from "react"
import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { AddBudgetPlanItemDTO } from "@/models/dto"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InventorySchema, VendorServiceSchema } from "@/models/schemas"
import type { AddPurchaseDTO } from "@/models/dto/purchasing.dto"
import { v4 } from "uuid"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { BudgetWithCategoryBudgetPlan } from "@/models/response/budget-with-category-budget-plan"
import { VendorWithService } from "@/models/response/vendor-with-service"

interface AddBudgetPlanItemProps {
  onAddBudgetItemPlan: (dto: AddBudgetPlanItemDTO) => Promise<void>
  onAddPurchasing: (dto: AddPurchaseDTO) => Promise<void>
  categoryId: number | undefined
  inventories: InventorySchema[]
  vendorServices: VendorWithService[]
  budgetPlan: BudgetWithCategoryBudgetPlan | null
}

export function AddBudgetItemPlanForm({
  onAddBudgetItemPlan,
  onAddPurchasing,
  categoryId,
  inventories,
  vendorServices,
  budgetPlan,
}: AddBudgetPlanItemProps) {
  const [open, setOpen] = useState(false)
  const [selectedVendorService, setSelectedVendorService] = useState<VendorServiceSchema[]>([])
  const [selectedInventory, setSelectedInventory] = useState<InventorySchema | null>(null)
  
  const form = useForm<AddBudgetPlanItemDTO>({
    resolver: zodResolver(AddBudgetPlanItemDTO),
    defaultValues: {
      budget_id: budgetPlan?.budget_id || "",
      item_subtotal: 0,
      category_id: categoryId,
      vendor_id: null,
      source: "vendor",
      item_name: "",
      description: "",
      created_by: "",
    },
  })

  const onSubmit = async (data: AddBudgetPlanItemDTO) => {
    try {
      if (data.source === "inventory" && !data.inventory_id) {
        form.setError("inventory_id", { message: "Please select an inventory item" })
        return
      }
      if (data.source === "inventory" && (data.item_qty || 0) > ((selectedInventory?.item_qty || 0)-(selectedInventory?.item_qty_damaged || 0)-(selectedInventory?.item_qty_reserved || 0))) {
        form.setError("item_qty", { message: "Available Inventory is not sufficient to reserved" })
        return
      }
      if (data.source === "vendor" && !data.vendor_service_id) {
        form.setError("vendor_service_id", { message: "Please select a vendor service" })
        return
      }
      if (data.source === "other") {
        if (!data.item_name) {
          form.setError("item_name", { message: "Item name is required" })
          return
        }
        if (!data.item_price || data.item_price <= 0) {
          form.setError("item_price", { message: "Item price must be greater than 0" })
          return
        }

        const { item_name, item_price, description, created_by, ...budgetPlanData } = data
        
        const purchaseData: AddPurchaseDTO = {
          other_item_id: budgetPlanData.other_item_id || v4(),
          item_name: item_name,
          item_price: item_price,
          description: description || "",
          created_by: created_by || "",
        }

        await onAddPurchasing(purchaseData)
        await onAddBudgetItemPlan(budgetPlanData)
      } else {
        const { item_name, item_price, description, created_by, ...budgetPlanData } = data
        
        if (item_name || item_price || description || created_by) {
          form.reset({ item_name: "", item_price: 0, description: "", created_by: "" })
        }
        
        await onAddBudgetItemPlan(budgetPlanData)
      }
      form.reset()
      setOpen(false)
    } finally{
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
      form.setValue("vendor_service_id", "")
      form.setValue("inventory_id", "")

      if (selectedSource === "other") {
        const newId = v4()
        form.setValue("other_item_id", newId)
      } else {
        form.setValue("item_name", "")
        form.setValue("description", "")
        form.setValue("item_price", 0)
      }
      form.setValue("item_subtotal", 0)
    }
  }, [selectedSource, form])

  useEffect(() => {
    let price = 0

    if (selectedSource === "inventory" && selectedInventoryId) {
      const item = inventories.find((item) => item.inventory_id === selectedInventoryId)
      if (item) {
        price = item.item_price
        setSelectedInventory(item);
        form.setValue("item_name", item.item_name)

      }
    } else if (selectedSource === "vendor" && selectedVendorServiceId) {
      const service = selectedVendorService.find((service) => service.service_id === selectedVendorServiceId)
      if (service) {
        price = service.price
        form.setValue("item_name", service.service_name)
      }
    } else if (selectedSource === "other") {
      price = otherItemPrice || 0
    }
    form.setValue("item_price", price)

    form.setValue("item_subtotal", price * quantity)
  }, [selectedSource, selectedInventoryId, selectedVendorServiceId, otherItemPrice, form, inventories, vendorServices, quantity, selectedVendorService])

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
        <Button variant={"ghost"}>
          <Plus size={18} className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Budget Plan Item</DialogTitle>
          <DialogDescription>Fill all the data field to add budget plan item</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-item-plan-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Budget Item Source..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="other">Others</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
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
                        <Input type="number" min="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                      ): (
                        <Input type="number" min="0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>

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
                        value= {(selectedInventory?.item_qty || 0)-(selectedInventory?.item_qty_damaged || 0)-(selectedInventory?.item_qty_reserved || 0)-quantity}
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
                      value={formatCurrency(field.value)}
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {}
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant={"secondary"} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={"default"}
                type="submit"
                form="add-item-plan-form"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
