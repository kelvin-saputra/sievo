"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronsUpDown } from "lucide-react";

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
import { AddInventoryDTO } from "@/models/dto";
import { useEdgeStore } from "@/lib/edgestore";
import { FileState, MultiImageDropzone } from "../../ui/multi-image-dropzone";

interface AddInventoryModalProps {
  onAddInventory: (data: AddInventoryDTO) => void;
}

export function AddInventoryModal({ onAddInventory }: AddInventoryModalProps) {
  const [open, setOpen] = useState(false);
  const { edgestore } = useEdgeStore();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      item_name: "",
      item_qty: 0,
      item_price: 0.0,
      inventory_photo: [] as string[],
      category: InventoryCategoryEnum.enum.CONSUMABLE,
      is_avail: true,
      description: "",
      created_by: "550e8400-e29b-41d4-a716-446655440000", // Dummy UUID
      updated_by: "550e8400-e29b-41d4-a716-446655440000", // Dummy UUID (optional)
      created_at: new Date(), // ISO date format
      updated_at: new Date(), // ISO date format    
    },
  });

  console.log(form.formState.errors); 

  const onSubmit = (data: AddInventoryDTO) => {
    console.log("Form submitted:", data);
    onAddInventory(data);
    form.reset();
    setOpen(false);
  };
  async function uploadFiles(addedFiles: FileState[]) {
    const uploadedUrls: string[] = [];
    setIsUploading(true);

    await Promise.all(
      addedFiles.map(async (fileState) => {
        if (fileState.file instanceof File) {
          try {
            const res = await edgestore.publicFiles.upload({
              file: fileState.file,
            });
            uploadedUrls.push(res.url);
          } catch (err) {
            console.error("Upload error:", err);
          }
        }
      })
    );

    console.log("Uploaded URLs:", uploadedUrls);
    form.setValue("inventory_photo", uploadedUrls);
    setIsUploading(false);
  }

  return (
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            form.reset(); 
            setFileStates([]); 
          }
          setOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">+ Add Inventory</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="add-inventory-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="inventory_photo"
              render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <div>
                         <FormField
                          control={form.control}
                          name="inventory_photo"
                          render={() => (
                            <FormItem>
                              <FormLabel>Upload Images</FormLabel>
                              <FormControl>
                                <div className="max-h-[300px] overflow-y-auto border border-gray-300 p-2 rounded-lg">
                                  <MultiImageDropzone
                                    value={fileStates}
                                    dropzoneOptions={{ maxFiles: 6 }}
                                    onChange={setFileStates}
                                    onFilesAdded={(files) => {
                                      setFileStates(files);
                                      uploadFiles(files);
                                      field.onChange(files.map(f => f.file));
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      </div>
                    </FormControl>
                  <FormMessage />
                    {isUploading && <p className="text-red-500 text-sm">Uploading images, please wait...</p>}
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
                <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={() => {
                    form.reset(); 
                    setFileStates([]); 
                    setOpen(false); 
                  }}
                >
                  Cancel
                </Button>
              <Button 
                type="submit" 
                form="add-inventory-form" 
                className="bg-green-500 text-white"
                disabled={isUploading } 
              >
                {isUploading ? "Uploading..." : "Add Inventory"} 
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}