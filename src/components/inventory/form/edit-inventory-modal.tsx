"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { InventoryCategoryEnum } from "@/models/enums";
import { InventorySchema } from "@/models/schemas/inventory";
import { UpdateInventoryDTO } from "@/models/dto/inventory.dto";

interface EditInventoryModalProps {
  inventory: UpdateInventoryDTO; 
  onUpdateInventory: (data: unknown) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditInventoryModal({ inventory, onUpdateInventory }: EditInventoryModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      item_name: inventory.item_name,
      item_qty: inventory.item_qty,
      item_price: inventory.item_price,
      inventory_photo: inventory.inventory_photo,
      category: inventory.category,
      is_avail: inventory.is_avail,
      description: inventory.description,
      updated_by: inventory.updated_by,
      updated_at: new Date()
    },
  });

  const onSubmit = (data: unknown) => {
    console.log("Form submitted:", data);
    onUpdateInventory(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">Edit Inventory</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="edit-inventory-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="item_qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional details (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {field.value ? field.value : "Select category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {Object.values(InventoryCategoryEnum.enum).map((cat) => (
                                <CommandItem
                                  key={cat}
                                  value={cat}
                                  onSelect={() => field.onChange(cat)}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  {cat}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="edit-inventory-form" className="bg-green-500 text-white">
                Update Inventory
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}