"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const formSchema = z.object({
  item_name: z.string().min(2, { message: "Item name must be at least 2 characters." }),
  description: z.string().optional(),
  item_qty: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
  category: z.enum(["CONSUMABLE", "NON_CONSUMABLE"], { message: "Invalid category." }),
  item_price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
  inventory_photo: z
    .any()
    .refine((files) => files?.length > 0, "At least one image is required.")
    .refine((files) => files.every((file: File) => file.size <= MAX_FILE_SIZE), "Max file size is 5MB.")
    .refine((files) => files.every((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Only .jpg and .png formats are supported."),
});

export function AddItemForm({ onSubmit }: { onSubmit: (data: unknown) => Promise<void> }) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages([...selectedImages, ...fileArray]);
      setImagePreviews([...imagePreviews, ...fileArray.map((file) => URL.createObjectURL(file))]);
    }
  }

  function removeImage(index: number) {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      ...values,
      inventory_photo: selectedImages.map((file) => URL.createObjectURL(file)),
      is_avail: true,
      created_by: "system", // Change this accordingly
      created_at: new Date(),
      updated_at: new Date(),
    };
    await onSubmit(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="item_qty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter quantity" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CONSUMABLE">Consumable</SelectItem>
                  <SelectItem value="NON_CONSUMABLE">Non-Consumable</SelectItem>
                </SelectContent>
              </Select>
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
                <Input type="number" placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Upload Images</FormLabel>
          <FormControl>
            <Input type="file" accept="image/png, image/jpeg" multiple onChange={handleImageChange} />
          </FormControl>
          <div className="flex flex-wrap gap-2 mt-2">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image 
                  src={src} 
                  alt={`Preview ${index}`} 
                  width={96} 
                  height={96} 
                  className="w-full h-full object-cover rounded-md"
                  unoptimized
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </FormItem>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}