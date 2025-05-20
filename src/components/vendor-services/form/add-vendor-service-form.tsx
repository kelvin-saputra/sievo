"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { VendorServiceCategoryEnum } from "@/models/enums"
import { useSafeContext } from "@/hooks/use-safe-context"
import VendorServiceContext from "@/models/context/vendor-service-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddVendorServiceDTO } from "@/models/dto"

interface AddVendorServiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddVendorService: (data: AddVendorServiceDTO) => Promise<void>;
}

export function AddVendorServiceForm({ open, onOpenChange }: AddVendorServiceFormProps) {
	const form = useForm<AddVendorServiceDTO>({
			resolver: zodResolver(AddVendorServiceDTO),
			defaultValues: {
					vendor_id: "",
					service_name: "",
					category: VendorServiceCategoryEnum.Enum.OTHERS,
					price: 0,
					rating: 0,
					description: "",
			},
	})

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { vendorServices, handleAddVendorService } = useSafeContext(VendorServiceContext, "VendorServiceContext")

  async function onSubmit(data: AddVendorServiceDTO) {
		setIsSubmitting(true);
    try {
			const requestData = AddVendorServiceDTO.parse(data);

      await handleAddVendorService(requestData)
    } catch (error) {
			console.error("Error adding vendor service:", error)
    } finally {
			form.reset()
			setIsSubmitting(false);
      onOpenChange(false)
		}
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Layanan Vendor</DialogTitle>
          <DialogDescription>Isi form berikut untuk menambahkan layanan vendor baru.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vendor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih vendor" />
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
              name="service_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Layanan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama layanan" {...field} />
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
                  <FormLabel>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VendorServiceCategoryEnum.options.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1000" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan deskripsi layanan" className="resize-none" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="5" step="0.1" placeholder="0-5" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}