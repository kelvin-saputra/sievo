"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VendorServiceCategoryEnum } from "@/models/enums"
import { VendorServiceActions } from "./vendor-service-action"
import Link from "next/link"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export type VendorService = {
  vendor_id: string
  contact_id: string
  bankAccountDetail: string | null | undefined
  vendor_name: string
  service_id: string
  service_name: string
  category: VendorServiceCategoryEnum
  price: number
  rating: number | undefined
  description: string | undefined
  is_deleted: boolean | undefined
}

// Column definitions for data table
export const columns: ColumnDef<VendorService>[] = [
  {
    accessorKey: "vendor_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Vendor Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const vendorName = row.getValue("vendor_name") as string
      const contactId = row.original.contact_id
      
      return (
        <div className="flex items-center">
          <Link
            href={`/contact/${contactId}`} 
            className="flex items-center hover:text-primary hover:underline"
          >
            {vendorName}
          </Link>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "service_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Service Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"))
      return <div className="text-left">{formatPrice(price)}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <VendorServiceActions vendor_service={row.original} />,
  }
]
