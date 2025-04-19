"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { useEdgeStore } from "@/lib/edgestore";
import { FileState, MultiImageDropzone } from "../../ui/multi-image-dropzone";

interface EditInventoryModalProps {
  inventory: InventorySchema;
  onUpdateInventory: (inventoryId: string, data: UpdateInventoryDTO) => Promise<void>;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const convertUrlsToFileStates = (urls: string[]): FileState[] => {
  return (urls || []).map((url, idx) => ({
    key: `existing-${idx}`,
    file: url,
    progress: "COMPLETE",
  }));
};

export function EditInventoryModal({ inventory, onUpdateInventory }: EditInventoryModalProps) {
  const [open, setOpen] = useState(false);
  const { edgestore } = useEdgeStore();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      ...inventory,
      updated_at: new Date()
    },
  });

  // This effect syncs the form's inventory_photo field with the fileStates
  useEffect(() => {
    if (fileStates) {
      const photoUrls = fileStates
        .map(fs => fs.file)
        .filter((file): file is string => typeof file === 'string');
        
      // Update form value whenever fileStates changes
      form.setValue("inventory_photo", photoUrls);
    }
  }, [fileStates, form]);

  const onSubmit = (data: UpdateInventoryDTO) => {
    // Data already contains updated inventory_photo from the effect
    onUpdateInventory(inventory.inventory_id, data);
    form.reset();
    setFileStates([]);
    setOpen(false);
  };

  const uploadFiles = async (addedFiles: FileState[]) => {
    setIsUploading(true);

    try {
      // Upload each new file and collect URLs
      const newUrls = await Promise.all(
        addedFiles.map(async (fileState) => {
          if (fileState.file instanceof File) {
            try {
              const res = await edgestore.publicFiles.upload({
                file: fileState.file,
              });
              return res.url;
            } catch (err) {
              console.error("Upload error:", err);
              return null;
            }
          }
          return null;
        })
      );

      // Update fileStates with completed uploads
      setFileStates(prevFiles => {
        return prevFiles.map(fs => {
          if (fs.progress === 'PENDING') {
            const index = addedFiles.findIndex(af => af.key === fs.key);
            if (index >= 0 && newUrls[index]) {
              // Replace the File with the URL and mark as complete
              return {
                ...fs,
                file: newUrls[index] as string,
                progress: 'COMPLETE'
              };
            }
          }
          return fs;
        });
      });
    } catch (err) {
      console.error("Upload process error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilesChange = (newFileStates: FileState[]) => {
    setFileStates(newFileStates);
    
    // Extract URLs from fileStates to update form
    const photoUrls = newFileStates
      .map(fs => fs.file)
      .filter((file): file is string => typeof file === 'string');
      
    form.setValue("inventory_photo", photoUrls);
  };

  const handleFilesAdded = (newFiles: FileState[]) => {
    // Upload the new files and update URLs when done
    uploadFiles(newFiles);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset(inventory);
          setFileStates([]);
        } else {
          // Initialize with existing images
          const existingFiles = convertUrlsToFileStates(inventory.inventory_photo || []);
          setFileStates(existingFiles);
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">Edit Inventory</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Textarea placeholder="Optional description..." {...field} />
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
                          {field.value}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {Object.values(InventoryCategoryEnum.enum).map((cat) => (
                                <CommandItem key={cat} value={cat} onSelect={() => field.onChange(cat)}>
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

            <FormField
              control={form.control}
              name="inventory_photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Images</FormLabel>
                  <FormControl>
                    <div className="max-h-[300px] overflow-y-auto border border-gray-300 p-2 rounded-lg">
                      <MultiImageDropzone
                        value={fileStates}
                        dropzoneOptions={{ maxFiles: 6 }}
                        onChange={handleFilesChange}
                        onFilesAdded={handleFilesAdded}
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
                  form.reset(inventory);
                  setFileStates([]);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-500 text-white" disabled={isUploading}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}