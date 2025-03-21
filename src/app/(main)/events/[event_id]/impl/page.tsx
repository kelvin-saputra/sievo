"use client";

import React from "react";
import { useSafeContext } from "@/hooks/use-safe-context";
import EventContext from "@/models/context/event.context";
import { BudgetPlanItemSchema } from "@/models/schemas";
import { ActualBudgetManagementAccordion } from "@/components/budgetting/budget-actual-management.ts";
import { AddBudgetItemCategoryForm } from "@/components/form/create-category-form";
import { ImportDataModal } from "@/components/form/handle-import-data";

export default function EventBudgetImplementationPage() {
  const {
    actualBudget,
    actualBudgetItems,
    actualCategories,
    // inventories,
    vendorServices,
    loading: actualBudgetLoading,
    handleAddActualBudgetItem,
    handleDeleteActualBudgetItem,
    handleUpdateActualBudgetItem,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddPurchase,
    handleUpdatePurchase,
    handleImportBudgetData
  } = useSafeContext(EventContext, "EventContext");

  if (actualBudgetLoading) {
    return <div>Loading Budget Implementasi ...</div>;
  }

  const totalPriceMap = actualCategories.reduce<Record<string, number>>(
    (acc, category) => {
      const catItems = actualBudgetItems.filter(
        (item) => item.category_id === category.category_id
      );
      const catTotal = catItems.reduce(
        (sum, item) => sum + (item.item_subtotal ?? 0),
        0
      );
      const categoryName = category.category_name;
      acc[categoryName] = catTotal;
      return acc;
    },
    { actualBudget: 0 }
  );
  const totalPrice = Object.values(totalPriceMap).reduce(
    (sum, price) => sum + price,
    0
  );

  const categoriesDict = actualCategories.reduce<Record<string, any>>(
    (acc, category) => {
      acc[category.category_id] = 
      actualBudgetItems.filter(
        (item) => item.category_id === category.category_id
      );
      return acc;
    },
    {} as Record<string, BudgetPlanItemSchema[]> 
  );

  function formatRupiah(): string {
    const amount = totalPrice;
    return (amount ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  }


  return (
    <div>
      <div className="w-full max-w-[1200px] mx-auto p-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="border-b p-4 flex justify-between items-center">
            <div className="flex gap-2">
              <ImportDataModal
                onImportData={handleImportBudgetData}
              />
              <AddBudgetItemCategoryForm onAddBudgetItemCategory={handleAddCategory} is_actual={true} />
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Total */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">Projected Total</h2>
              <div className="text-2xl font-bold">{formatRupiah()}</div>
            </div>
            <ActualBudgetManagementAccordion
              actualCategories={actualCategories}
              categoriesActualItems={categoriesDict}
              // TODO: Add With Inventory and Vendor Services
              inventories={[]}
              vendorServices={vendorServices}
              actualBudget={actualBudget}
              totalPriceMap={totalPriceMap}
              handleAddActualBudget={handleAddActualBudgetItem}
              handleDeleteActualBudgetItem={handleDeleteActualBudgetItem}
              handleUpdateActualBudgetItem={handleUpdateActualBudgetItem}
              handleAddPurchasing={handleAddPurchase}
              handleUpdatePurchasing={handleUpdatePurchase}
              handleDeleteCategory={handleDeleteCategory}
              handleUpdateCategory={handleUpdateCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
