import { X } from "lucide-react";
import { AddBudgetItemPlanForm } from "./form/create-item-plan-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { InventorySchema } from "@/models/schemas";
import { AddBudgetPlanItemDTO, UpdateBudgetItemCategoryDTO, UpdateBudgetPlanItemDTO, UpdatePurchaseDTO } from "@/models/dto";
import { AddPurchaseDTO } from "@/models/dto";
import { DeleteCategoryModal } from "./form/delete-category-form";
import { UpdateBudgetItemCategoryForm } from "./form/update-category-form";
import { Badge } from "../ui/badge";
import { UpdateBudgetItemPlanForm } from "./form/update-item-plan-form";
import { DeleteBudgetPlanItemModal } from "./form/delete-item-plan-form";
import { BudgetWithCategoryBudgetPlan } from "@/models/response/budget-with-category-budget-plan";
import { VendorWithService } from "@/models/response/vendor-with-service";
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";
import { useSafeContext } from "@/hooks/use-safe-context";
import EventContext from "@/models/context/event.context";

interface BudgetManagementAccordionProps {
    budgetDataPlan: BudgetWithCategoryBudgetPlan | null;
    totalPriceByCategory: Record<string, number>;
    inventories: InventorySchema[];
    vendorServices: VendorWithService[];
    handleAddBudgetItemPlan: (data: AddBudgetPlanItemDTO) => Promise<void>;
    handleUpdateBudgetItemPlan: (data: UpdateBudgetPlanItemDTO) => Promise<void>;
    handleDeleteBudgetItemPlan: (budgetItemId: string) => Promise<void>;
    handleAddPurchasing: (data: AddPurchaseDTO) => Promise<void>;
    handleUpdatePurchasing: (data: UpdatePurchaseDTO) => Promise<void>;
    handleDeleteCategory: (categoryId: number, isActual: boolean) => Promise<void>;
    handleUpdateCategory: (categoryId: number, data: UpdateBudgetItemCategoryDTO) => void;
}
export function BudgetManagementAccordion({
  budgetDataPlan,
  totalPriceByCategory, 
  inventories, 
  vendorServices,
  handleAddBudgetItemPlan, 
  handleUpdateBudgetItemPlan,
  handleDeleteBudgetItemPlan,
  handleDeleteCategory,
  handleUpdateCategory,
  handleAddPurchasing,
  handleUpdatePurchasing
}: BudgetManagementAccordionProps) {
  const formatToRupiah = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')},00`;
  };

  const { event } = useSafeContext(EventContext, "EventContext")
  return (
      <>
        <Accordion type="multiple" defaultValue={["1"]}>
          {budgetDataPlan?.categories.map((category) => (
            <AccordionItem key={category?.category_id} value={category?.category_name||""} className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-row items-center gap-2">
                    <span className="font-medium">
                      {category?.category_name}
                    </span>
                      {category && (budgetDataPlan.status !== "APPROVED" && checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(event.status)) && (
                        <UpdateBudgetItemCategoryForm
                          category={{
                            is_deleted: category.is_deleted,
                            category_id: category.category_id,
                            category_name: category.category_name,
                          }}
                          onUpdateBudgetItemCategory={handleUpdateCategory}
                        />
                      )}
                  </div>
                  <div className="flex items-center gap-8">
                        <span className="font-medium">{formatToRupiah(totalPriceByCategory[category?.category_name||""])}</span>
                        {category && budgetDataPlan.status !== "APPROVED" && checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(event.status) && (
                        <DeleteCategoryModal
                          onDeleteCategory={handleDeleteCategory}
                          categoryName={category?.category_name || ""}
                          categoryId={category?.category_id || 0}
                          is_actual={false}
                          trigger={
                              <X size={18} />
                          }
                        />
                        )}
                      </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                {/* Table header */}
                <div className="grid grid-cols-6 gap-4 border-b font-bold">
                  <div className="col-span-1">Item</div>
                  <div className="col-span-1">Basic Price</div>
                  <div className="col-span-1">Quantity</div>
                  <div className="col-span-1">Subtotal</div>
                  <div className="col-span-1">Source</div>
                  <div className="col-span-1 flex justify-end">
                      {category && budgetDataPlan.status !== "APPROVED" && checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(event.status) && (
                      <AddBudgetItemPlanForm
                        categoryId={category?.category_id}
                        onAddBudgetItemPlan={handleAddBudgetItemPlan}
                        onAddPurchasing={handleAddPurchasing} 
                        inventories={inventories}
                        vendorServices={vendorServices}
                        budgetPlan={budgetDataPlan}
                      />
                      )}
                  </div>
                </div>
    
                {/* Table rows */}
                {category?.budget_plan_item.length === 0 ? (
                      <div className="py-8 text-center text-gray-500 italic">
                        No items added yet. Click the + button to add an item.
                      </div>
                    ) : (
                      category?.budget_plan_item.map((item) => (
                        <div
                          key={item?.budget_item_id}
                          className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50 rounded-md transition-colors"
                        >
                          {item?.inventory_id ? (
                            <>
                              <div className="col-span-1">
                                <div className="text-gray-800">{item.inventory?.item_name}</div>
                              </div>
                              <div className="col-span-1">
                                <div className="text-gray-700">{formatToRupiah(item.inventory?.item_price || 0)}</div>
                              </div>
                              <div className="col-span-1 text-center">
                                <div className="text-gray-700">{item.item_qty}</div>
                              </div>
                              <div className="col-span-1">
                                <div className="font-medium text-gray-800">{formatToRupiah(item.item_subtotal)}</div>
                              </div>
                              <div className="col-span-1">
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                  Inventory
                                </Badge>
                              </div>
                              <div className="col-span-1 flex justify-end gap-2">
                                {budgetDataPlan.status !== "APPROVED" && checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(event.status) && (
                                  <>
                                    <UpdateBudgetItemPlanForm
                                      onUpdateBudgetItemPlan={handleUpdateBudgetItemPlan}
                                      onUpdatePurchasing={handleUpdatePurchasing}
                                      categoryId={category.category_id}
                                      existingItem={item}
                                      inventories={inventories}
                                      vendorServices={vendorServices}
                                      currentSource="inventory"
                                    />
                                    <DeleteBudgetPlanItemModal
                                      onDeleteItemPlan={handleDeleteBudgetItemPlan}
                                      budgetItemId={item.budget_item_id}
                                    />
                                  </>
                                )}
                              </div>
                            </>
                          ) : item?.vendor_service_id ? (
                            <>
                              <div className="col-span-1">
                                <div className="">{item.vendor_service?.service_name}</div>
                              </div>
                              <div className="col-span-1">
                                <div className="text-gray-700">{formatToRupiah(item.vendor_service?.price || 0)}</div>
                              </div>
                              <div className="col-span-1 text-center">
                                <div className="text-gray-700">{item.item_qty}</div>
                              </div>
                              <div className="col-span-1">
                                <div className="font-medium text-sm">{formatToRupiah(item.item_subtotal)}</div>
                              </div>
                              <div className="col-span-1">
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Vendor</Badge>
                              </div>
                              <div className="col-span-1 flex justify-end gap-2">
                                {budgetDataPlan.status !== "APPROVED" && checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(event.status) && (
                                  <>
                                    <UpdateBudgetItemPlanForm
                                      onUpdateBudgetItemPlan={handleUpdateBudgetItemPlan}
                                      onUpdatePurchasing={handleUpdatePurchasing}
                                      categoryId={category.category_id}
                                      existingItem={item}
                                      inventories={inventories}
                                      vendorServices={vendorServices}
                                      currentSource="vendor"
                                    />
                                    <DeleteBudgetPlanItemModal
                                      onDeleteItemPlan={handleDeleteBudgetItemPlan}
                                      budgetItemId={item.budget_item_id}
                                    />
                                  </>
                                )}
                              </div>
                            </>
                          ) : item?.other_item_id ? (
                            <>
                              <div className="col-span-1">
                                <div className="font-medium text-gray-800">{item.other_item?.item_name}</div>
                              </div>
                              <div className="col-span-1">
                                <div className="text-gray-700">{formatToRupiah(item.other_item?.item_price || 0)}</div>
                              </div>
                              <div className="col-span-1 text-center">
                                <div className="text-gray-700">{item.item_qty}</div>
                              </div>
                              <div className="col-span-1">
                                <div className="font-medium text-gray-800">{formatToRupiah(item.item_subtotal)}</div>
                              </div>
                              <div className="col-span-1">
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Purchase</Badge>
                              </div>
                              <div className="col-span-1 flex justify-end gap-2">
                                {budgetDataPlan.status !== "APPROVED" && checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(event.status) && (
                                  <>
                                    <UpdateBudgetItemPlanForm
                                      onUpdateBudgetItemPlan={handleUpdateBudgetItemPlan}
                                      onUpdatePurchasing={handleUpdatePurchasing}
                                      categoryId={category.category_id}
                                      existingItem={item}
                                      inventories={inventories}
                                      vendorServices={vendorServices}
                                      currentSource="other"
                                    />
                                    <DeleteBudgetPlanItemModal
                                      onDeleteItemPlan={handleDeleteBudgetItemPlan}
                                      budgetItemId={item.budget_item_id}
                                    />
                                  </>
                                )}
                              </div>
                            </>
                          ) : null}
                        </div>
                      ))
                    )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </>
    )
  }
