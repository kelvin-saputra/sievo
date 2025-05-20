"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSafeContext } from "@/hooks/use-safe-context"
import VendorServiceContext from "@/models/context/vendor-service-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building, Mail, Phone, Star, StarHalf } from "lucide-react"
import type { VendorWithService } from "@/models/response/vendor-with-service"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vendorId = params.vendorId as string
  const [vendor, setVendor] = useState<VendorWithService | null>(null)
  const [loading, setLoading] = useState(true)

  const { vendorServices } = useSafeContext(VendorServiceContext, "VendorServiceContext")
  useEffect(() => {
    if (vendorServices && vendorServices.length > 0) {
      const foundVendor = vendorServices.find((v) => v.vendor_id === vendorId)
      setVendor(foundVendor || null)
      setLoading(false)
    }
  }, [vendorId, vendorServices])

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
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-semibold mb-2">Vendor not found</h2>
              <p className="text-muted-foreground mb-4">
                Vendor with ID {vendorId} was not found or has been deleted.
              </p>
              <Button onClick={() => router.push("/vendor-services")}>Back to Vendor List</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const averageRating =
    vendor.vendor_service.reduce((sum, service) => sum + (service.rating || 0), 0) / vendor.vendor_service.length || 0

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/vendor-service")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Vendor Service List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vendor Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>Contact details and vendor information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" /> {vendor.contact.name}
                </h3>
                {averageRating > 0 && <div className="mt-2">{renderRatingStars(averageRating)}</div>}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Contact</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{vendor.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{vendor.contact.phone_number}</span>
                </div>
              </div>

              {vendor.bankAccountDetail && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Bank Information</h4>
                    <p>{vendor.bankAccountDetail}</p>
                  </div>
                </>
              )}

              {vendor.contact.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                    <p>{vendor.contact.description}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Services */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Offered Services</CardTitle>
            <CardDescription>{vendor.vendor_service.length} services available from this vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {Array.from(new Set(vendor.vendor_service.map((service) => service.category))).map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {vendor.vendor_service.map((service) => (
                  <Card key={service.service_id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{service.service_name}</h3>
                            <Badge variant="outline">{service.category}</Badge>
                          </div>
                          {service.description && <p className="text-muted-foreground">{service.description}</p>}
                          {service.rating !== undefined && service.rating > 0 && (
                            <div>{renderRatingStars(service.rating)}</div>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0 md:text-right">
                          <div className="text-xl font-semibold">{formatPrice(service.price)}</div>
                          <Link href={`${vendorId}/${service.service_id}`}>
                            <Button size="sm" className="mt-2">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {Array.from(new Set(vendor.vendor_service.map((service) => service.category))).map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {vendor.vendor_service
                    .filter((service) => service.category === category)
                    .map((service) => (
                      <Card key={service.service_id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-medium">{service.service_name}</h3>
                                <Badge variant="outline">{service.category}</Badge>
                              </div>
                              {service.description && <p className="text-muted-foreground">{service.description}</p>}
                              {service.rating !== undefined && service.rating > 0 && (
                                <div>{renderRatingStars(service.rating)}</div>
                              )}
                            </div>
                            <div className="mt-4 md:mt-0 md:text-right">
                              <div className="text-xl font-semibold">{formatPrice(service.price)}</div>
                              <Link href={`${vendorId}/${service.service_id}`}>
                                <Button size="sm" className="mt-2">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
