"use client"
import { useSafeContext } from "@/hooks/use-safe-context"
import EventContext from "@/models/context/event.context"
import { Badge } from "@/components/ui/badge"
import { BudgetManagementAccordion } from "@/components/budgetting/budget-plan-accordion"
import { AddBudgetItemCategoryForm } from "@/components/budgetting/form/create-category-form"
import Loading from "@/components/ui/loading"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BudgetStatusEnum } from "@/models/enums"
import { UpdateBudgetDTO } from "@/models/dto"
import { getUserDataClient } from "@/lib/userData"
import { ImportDataModal } from "@/components/budgetting/handle-import-data"
import { ActualBudgetManagementAccordion } from "@/components/budgetting/budget-actual-management.ts"
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client"

export default function EventBudgetPlanningPage() {  
  const {
    event,
    budgetPlanData,
    inventories,
    vendorServices,
    budgetActualData,
    loading: actualBudgetLoading,
    loading: budgetPlanLoading,
    handleAddBudgetPlanItem,
    handleDeleteBudgetPlanItem,
    handleUpdateBudgetPlanItem,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddPurchase,
    handleUpdatePurchase,
    handleUpdateBudgetPlanStatus,
    handleAddActualBudgetItem,
    handleDeleteActualBudgetItem,
    handleUpdateActualBudgetItem,
    handleImportBudgetData
  } = useSafeContext(EventContext, "EventContext")

    if (actualBudgetLoading || budgetPlanLoading) {
      return <Loading message="Fetching Budget Data..." />
    }
  
    const totalPriceByCategoryActual = budgetActualData?.categories?.reduce((acc, category) => {
      const totalPrice = category?.actual_budget_item
        .filter(item => !item?.is_deleted)
        .reduce((sum, item) => sum + (item?.item_subtotal ?? 0), 0);
      
      if (category?.category_name) {
        acc[category.category_name] = totalPrice ?? 0;
      }
      return acc
    }, {} as Record<string, number>) ?? {};

    const totalPriceByCategoryPlan = budgetPlanData?.categories?.reduce((acc, category) => {
      const totalPrice = category?.budget_plan_item
        .filter((item) => !item?.is_deleted)
        .reduce((sum, item) => sum + (item?.item_subtotal ?? 0), 0)
      if (category?.category_name) {
        acc[category.category_name] = totalPrice ?? 0
      }
      return acc
    },
    {} as Record<string, number>,
  ) ?? {}

    const totalActualBudget = totalPriceByCategoryActual
      ? Object.values(totalPriceByCategoryActual).reduce((sum, price) => sum+price, 0)
      : 0;

    const totalBudgetPlan = totalPriceByCategoryPlan
      ? Object.values(totalPriceByCategoryPlan).reduce((sum, price) => sum + price, 0)
      : 0;

  const handleStatusChange = (status: string) => {
    try {
      const data = {
        status: status,
        budget_id: budgetPlanData?.budget_id,
        updated_by: getUserDataClient().name
      }
      handleUpdateBudgetPlanStatus(UpdateBudgetDTO.parse(data));
    } finally {
    }
  }

  function formatRupiahActual(): string {
    const amount = totalActualBudget
    return (amount ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" })
  }

  function formatRupiahPlan(): string {
    const amount = totalBudgetPlan
    return (amount ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" })
  }



  const getStatusColorClass = (status: string | undefined) => {
    switch (status) {
      case "PENDING":
        return "bg-warning hover:bg-warning/80"
      case "APPROVED":
        return "bg-success hover:bg-success/80"
      case "REJECTED":
        return "bg-danger hover:bg-danger/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div>
      <div className="w-full mx-auto p-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="border-b p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">Approval Status:</span>
              {budgetPlanData?.status !== "APPROVED" && !["DONE"].includes(event.status) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Badge className={`cursor-pointer shadow-lg ${getStatusColorClass(budgetPlanData?.status)}`}>
                      {budgetPlanData?.status || "PENDING"}
                    </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {BudgetStatusEnum.options.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="cursor-pointer w-full flex items-center justify-between gap-2"
                    >
                      <span className="rounded px-2 py-1 text-xs font-semibold truncate max-w-[130px]">
                        <Badge className={getStatusColorClass(status)}>{status}</Badge>
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              ): (
                <Badge className={`cursor-pointer shadow-lg ${getStatusColorClass(budgetPlanData?.status)}`}>
                  {budgetPlanData?.status || "PENDING"}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {budgetPlanData?.status !== "APPROVED" && !["DONE"].includes(event.status) && (
                <AddBudgetItemCategoryForm onAddBudgetItemCategory={handleAddCategory} is_actual={false} />
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">Projected Budget</h2>
              <div className="text-2xl font-bold">{formatRupiahPlan()}</div>
            </div>
            <BudgetManagementAccordion
              budgetDataPlan={budgetPlanData}
              inventories={inventories}
              vendorServices={vendorServices}
              totalPriceByCategory={totalPriceByCategoryPlan}
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
      {(budgetPlanData?.status === "APPROVED" || ["DONE"].includes(event.status)) && (
        <div className="w-full mx-auto p-4">
          <div className="border rounded-lg overflow-hidden">
            <div className={`border-b p-4 flex ${!["DONE"].includes(event.status)?"justify-between":"justify-start"} items-center`}>
              <div>
                <div className="flex flex-col items-start w-full mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Budget Usage:</span>
                    <span className="text-sm font-semibold">
                        {totalBudgetPlan > 0
                        ? `${((totalActualBudget / totalBudgetPlan) * 100).toFixed(2)}%`
                        : "0%"}
                    </span>
                  </div>
                  <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: totalBudgetPlan > 0
                          ? `${((totalActualBudget / totalBudgetPlan) * 100).toFixed(2)}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
                <div>
                  <div className="flex gap-2 ">
                    {!["DONE"].includes(event.status) && checkRoleClient(ADMINEXECUTIVEINTERNAL) && (
                      <>
                        { budgetActualData && budgetActualData?.categories.length === 0 && (
                          <ImportDataModal 
                            onImportData={handleImportBudgetData}
                          />
                        )}
                        <AddBudgetItemCategoryForm onAddBudgetItemCategory={handleAddCategory} is_actual={true} />
                      </>
                    )}
                  </div>
                </div>
            </div>

            <div>
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-bold">Budget Realization</h2>
                <div className="text-2xl font-bold">{formatRupiahActual()}</div>
              </div>
              <ActualBudgetManagementAccordion
                budgetDataActual={budgetActualData}
                totalPriceByCategory={totalPriceByCategoryActual}
                inventories={inventories}
                vendorServices={vendorServices}
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
      )}
      </div>
  )
}