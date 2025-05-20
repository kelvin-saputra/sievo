"use client";

import { useEffect } from "react";
import PageHeader from "@/components/common/page-header";
import useInventory from "@/hooks/use-inventory";
import { AddInventoryModal } from "@/components/inventory/form/add-inventory-modal";
import { InventoryTable } from "../../../components/inventory/data-table";
import { inventoryColumns } from "../../../components/inventory/columns";
import * as React from 'react';
import Loading from "@/components/ui/loading";

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

  if (loading) {
    return (
      <Loading message="Fetching inventory data..." />
    )
  }
  
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
        <InventoryTable
          columns={inventoryColumns}
          data={inventories}
        />
      </div>
    </div>
  );
}