"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import useVendor from "@/hooks/use-vendor"
import useEvent from "@/hooks/use-event"
import useInventory from "@/hooks/use-inventory"
import useContact from "@/hooks/use-contact"
import type { ContactSchema, EventSchema, InventorySchema } from "@/models/schemas"
import type { VendorWithService } from "@/models/response/vendor-with-service"

export function BreadcrumbApp() {
  const [eventPath, setEvent] = useState<EventSchema | null>(null)
  const [vendorServicePath, setVendorService] = useState<VendorWithService | null>(null)
  const [inventoryPath, setInventory] = useState<InventorySchema | null>(null)
  const [contactPath, setContact] = useState<ContactSchema | null>(null)
  const paths = usePathname()
  const pathNames = useMemo(() => paths.split("/").filter((path) => path), [paths])

  const { vendorServices, fetchAllVendorServices } = useVendor(pathNames[1] || "")
  const { event, fetchEventById } = useEvent()
  const { inventory, fetchInventoryById } = useInventory()
  const { contact, fetchContactById } = useContact()

  // Format path names for display
  const formatPathName = (path: string) => {
    if (path.match(/^\d+$/)) return `#${path}`

    return path
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Fetch data based on the current path
  useEffect(() => {
    if (pathNames.length === 0) return

    const section = pathNames[0]
    const id = pathNames[1]

    if (!id) return

    if (section === "events") {
      fetchEventById(id)
    } else if (section === "inventory") {
      fetchInventoryById(id)
    } else if (section === "contact") {
      fetchContactById(id)
    } else if (section === "vendor-service") {
      fetchAllVendorServices()
    }
  }, [pathNames, fetchEventById, fetchInventoryById, fetchContactById, fetchAllVendorServices])

  useEffect(() => {
    if (pathNames[0] === "events" && event) {
      setEvent(event)
    }
  }, [pathNames, event])

  useEffect(() => {
    if (pathNames[0] === "inventory" && inventory) {
      setInventory(inventory)
    }
  }, [pathNames, inventory])

  useEffect(() => {
    if (pathNames[0] === "contact" && contact) {
      setContact(contact)
    }
  }, [pathNames, contact])

  useEffect(() => {
    if (pathNames[0] === "vendor-service" && vendorServices) {
      setVendorService(Array.isArray(vendorServices) ? (vendorServices[0] ?? null) : vendorServices)
    }
  }, [pathNames, vendorServices])

  const breadcrumbItems = useMemo(() => {
    if (pathNames.length === 0) {
      return [
        <BreadcrumbItem key="home">
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
        </BreadcrumbItem>,
      ]
    }

    return pathNames.map((path, index) => {
      const href = `/${pathNames.slice(0, index + 1).join("/")}`
      const isLast = index === pathNames.length - 1

      let displayName = formatPathName(path)

      if (index === 1) {
        if (pathNames[0] === "events" && eventPath) {
          displayName = eventPath.event_name || displayName
        } else if (pathNames[0] === "inventory" && inventoryPath) {
          displayName = inventoryPath.item_name || displayName
        } else if (pathNames[0] === "contact" && contactPath) {
          displayName = contactPath.name || displayName
        } else if (pathNames[0] === "vendor-service" && vendorServicePath) {
          displayName = vendorServicePath.contact.name || displayName
        }
      } else if (index === 2 && pathNames[0] === "vendor-service" && vendorServicePath) {
        console.log(path)
        const selectedService = vendorServicePath.vendor_service.find((vs) => vs.service_id.toUpperCase() === path.toUpperCase())
        if (selectedService) {
          displayName = selectedService.service_name || displayName
        }
      }

      return (
        <BreadcrumbItem key={path + index}>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          {isLast ? (
            <BreadcrumbPage className="text-sidebar-primary font-medium">{displayName}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href} className="text-muted-foreground hover:text-sidebar-primary transition-colors">
              {displayName}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      )
    })
  }, [pathNames, eventPath, inventoryPath, contactPath, vendorServicePath])

  if (pathNames.length === 0) {
    return null
  }

  return (
    <header className="flex h-11 items-center gap-2 border-b px-4 fixed w-screen bg-super-white z-1 shadow">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-muted-foreground hover:text-sidebar-primary transition-colors">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbItems}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
