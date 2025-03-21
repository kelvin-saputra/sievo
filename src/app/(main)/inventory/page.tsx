"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/common/page-header";
import useInventory from "@/hooks/use-inventory";
import { AddInventoryModal } from "@/components/inventory/add-inventory-modal";
import { InventoryTable } from "./data-table";
import { inventoryColumns } from "./columns";
import * as React from 'react';

export default function ViewAllInventory() {
  const {
    inventories,
    loading,
    fetchAllInventories,
    handleAddInventory,
  } = useInventory();

  useEffect(() => {
    fetchAllInventories();
  }, [fetchAllInventories]);
  
  
  return (
    <div className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto overflow-hidden">
      <div className="hidden md:block md:w-[250px] lg:w-[280px]"></div>

    <PageHeader
        title="Inventory Overview"
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }]}
      />

      <div className="mb-4 md:mb-6 flex justify-end">
        <AddInventoryModal onAddInventory={handleAddInventory} />
      </div>


      <div className="mb-8 p-4 md:p-6 border rounded-lg shadow-sm md:shadow-lg bg-white overflow-x-auto">

        {loading ? (
          <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
        ) : (
          <InventoryTable
            columns={inventoryColumns}
            data={inventories}
          />
        )}
      </div>
    </div>
  );
}

 
