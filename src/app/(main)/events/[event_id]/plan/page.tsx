"use client";

import React from "react";
import { useSafeContext } from "@/hooks/use-safe-context"
import EventContext from "@/models/context/event.context";
import { Badge } from "@/components/ui/badge";
import { BudgetManagementAccordion } from "@/components/budgetting/budget-plan-accordion";
import { BudgetPlanItemSchema } from "@/models/schemas";
import { AddBudgetItemCategoryForm } from "@/components/form/create-category-form";

export default function EventBudgetPlanningPage() {
  const {
    budgetPlan,
    budgetPlanItems,
    categoriesPlan,
    // inventories,
    vendorServices,
    loading: budgetPlanLoading,
    handleAddBudgetPlanItem,
    handleDeleteBudgetPlanItem,
    handleUpdateBudgetPlanItem,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddPurchase,
    handleUpdatePurchase,
  } = useSafeContext(EventContext, "EventContext");

  if (budgetPlanLoading) {
    return <div>Loading Budget Planning ...</div>;
  }

  const totalPriceMap = categoriesPlan.reduce<Record<string, number>>(
    (acc, category) => {
      const catItems = budgetPlanItems.filter(
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
    { BudgetPlan: 0 }
  );
  const totalPrice = Object.values(totalPriceMap).reduce(
    (sum, price) => sum + price,
    0
  );

  const categoriesDict = categoriesPlan.reduce<Record<string, any>>(
    (acc, category) => {
      acc[category.category_id] = 
      budgetPlanItems.filter(
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
            <div className="flex items-center gap-2">
              <span className="font-medium">Approval Status:</span>
              <Badge
              className={
                budgetPlan?.status === "PENDING"
                ? "bg-warning"
                : budgetPlan?.status === "APPROVED"
                ? "bg-success"
                : budgetPlan?.status === "REJECTED"
                ? "bg-danger"
                : ""
              }
              >
              {budgetPlan?.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <AddBudgetItemCategoryForm onAddBudgetItemCategory={handleAddCategory} is_actual={false} />
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Total */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">Projected Total</h2>
              <div className="text-2xl font-bold">{formatRupiah()}</div>
            </div>
            <BudgetManagementAccordion
              categoriesPlan={categoriesPlan}
              categoriesItemPlan={categoriesDict}
              // TODO: Add With Inventory and Vendor Services
              inventories={[]}
              vendorServices={vendorServices}
              budgetPlan={budgetPlan}
              totalPriceMap={totalPriceMap}
              handleAddBudgetItemPlan={handleAddBudgetPlanItem}
              handleDeleteBudgetItemPlan={handleDeleteBudgetPlanItem}
              handleUpdateBudgetItemPlan={handleUpdateBudgetPlanItem}
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
