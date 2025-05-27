"use client";

import PageHeader from "@/components/common/page-header";
import Loading from "@/components/ui/loading";
import useVendor from "@/hooks/use-vendor";
import VendorServiceContext from "@/models/context/vendor-service-context";
import { useEffect } from "react";

export default function VendorServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const {
        loading,
        vendorServices,
        fetchAllVendorServices,
        handleAddVendorService,
        handleDeleteVendorService,
        handleUpdateVendorService
    } = useVendor("");

  useEffect(() => {
    fetchAllVendorServices()
  }, [fetchAllVendorServices]);

  if (loading) {
    return (<Loading message="Mengambil data vendor services..."/>)
  }
  
  return (
    <VendorServiceContext.Provider
      value={{
        loading,
        vendorServices,
        fetchAllVendorServices,
        handleAddVendorService,
        handleDeleteVendorService,
        handleUpdateVendorService
      }}
    >
      <div className="p-6 w-full mx-auto">
        <PageHeader title="Vendor Service Management" />
        <div className="p-6 bg-white rounded-lg shadow-md">{children}</div>
      </div>
    </VendorServiceContext.Provider>
  );
}
