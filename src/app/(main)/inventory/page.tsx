"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/common/page-header";
import useInventory from "@/hooks/use-inventory";
import { AddInventoryModal } from "@/components/inventory/form/add-inventory-modal";
import { InventoryTable } from "../../../components/inventory/data-table";
import { inventoryColumns } from "../../../components/inventory/columns";
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
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Inventory Overview"
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }]}
      />

      <div className="mb-6">
        <AddInventoryModal onAddInventory={handleAddInventory} />
      </div>


      <div className="mb-8 p-6 border rounded-lg shadow-lg bg-super-white">

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