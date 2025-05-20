"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSafeContext } from "@/hooks/use-safe-context"
import VendorServiceContext from "@/models/context/vendor-service-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building, Calendar, Mail, Phone, Star, StarHalf } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { DeleteVendorServiceForm } from "@/components/vendor-services/form/delete-vendor-service-form"
import { VendorServiceSchema } from "@/models/schemas"
import { UpdateVendorServiceForm } from "@/components/vendor-services/form/update-vendor-service-form"
import Loading from "@/components/ui/loading"
import { ADMINEXECUTIVE, ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client"

interface ProcessedVendorService {
  service_id: string
  service_name: string
  category: string
  price: number
  rating: number | undefined
  description: string | undefined
  vendor_id: string
  vendor_name: string
  vendor_email: string
  vendor_phone: string
  contact_id: string
}

export default function VendorServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string
  const [service, setService] = useState<ProcessedVendorService | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdateForm, setUpdateForm] = useState(false);

  const { vendorServices, handleDeleteVendorService, handleUpdateVendorService } = useSafeContext(VendorServiceContext, "VendorServiceContext")
  useEffect(() => {
    if (vendorServices && vendorServices.length > 0) {
      for (const vendor of vendorServices) {
        const foundService = vendor.vendor_service.find((svc) => svc.service_id === serviceId)
        if (foundService) {
          setService({
            service_id: foundService.service_id,
            service_name: foundService.service_name,
            category: foundService.category,
            price: foundService.price,
            rating: foundService.rating,
            description: foundService.description,
            vendor_id: vendor.vendor_id,
            vendor_name: vendor.contact.name,
            vendor_email: vendor.contact.email,
            vendor_phone: vendor.contact.phone_number,
            contact_id: vendor.contact_id
          })
          break
        }
      }
      setLoading(false)
    }
  }, [serviceId, vendorServices])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <Loading message="Fetching vendor service data..."/>
    )
  }

  if (!service) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-xl font-semibold mb-2">Vendor Service not found</h2>
                <p className="text-muted-foreground mb-4">
                Service with ID {serviceId} was not found or has been deleted.
                </p>
                <Button onClick={() => router.push("/vendor-service")}>Back to Vendor Service List</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/vendor-service")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Vendor Service List
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Badge className="mb-2">{service.category}</Badge>
              <CardTitle className="text-2xl">{service.service_name}</CardTitle>
              <div className="flex items-center gap-2">
                  <Badge variant="outline">ID: {service.service_id.substring(0, 8)}...</Badge>
                </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold">{formatPrice(service.price)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {service.rating !== undefined && service.rating > 0 && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Rating:</span>
                {renderRatingStars(service.rating)}
              </div>
            )}

            {service.description && (
              <div>
                <h3 className="text-lg font-medium mb-2">Service Description</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Available for booking</span>
                </div>
              </div>
            </div>
          </div>
          {checkRoleClient(ADMINEXECUTIVEINTERNAL) && (
            <div className="flex justify-end gap-3 pt-4">
              <Button variant={"outline"} onClick={() => setUpdateForm(true)}>Update Service</Button>
              <DeleteVendorServiceForm
                onDeleteVendorServices={handleDeleteVendorService}
                serviceId={serviceId}
                existingVendor={VendorServiceSchema.parse(service)}
                trigger={<Button variant={"destructive"}>Delete</Button>}
              />
              {checkRoleClient(ADMINEXECUTIVE) && (
                <UpdateVendorServiceForm 
                  open={isUpdateForm} 
                  existingVendorService={VendorServiceSchema.parse(service)}
                  onOpenChange={setUpdateForm}
                  onUpdateVendorService={handleUpdateVendorService}
                />
              )}
            </div>
          )}
          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Provided by</h3>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <Building className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary" />
                <div>
                  <h4 className="font-semibold text-lg">{service.vendor_name}</h4>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push(`/vendor-service/${service.vendor_id}`)}
                  >
                    View all services
                  </Button>
                </div>
              </div>
              <Separator className="hidden md:block" orientation="vertical" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{service.vendor_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{service.vendor_phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Link href={`/contact/${service.contact_id}`}>
              <Button>View Vendor</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
