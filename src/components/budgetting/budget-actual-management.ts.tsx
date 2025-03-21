import { X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { BudgetItemCategorySchema, BudgetSchema, InventorySchema, VendorServiceSchema } from "@/models/schemas";
import { AddActualBudgetItemDTO, UpdateActualBudgetItemDTO, UpdateBudgetItemCategoryDTO, UpdatePurchaseDTO } from "@/models/dto";
import { AddPurchaseDTO } from "@/models/dto";
import { DeleteCategoryModal } from "../form/delete-category-form";
import { UpdateBudgetItemCategoryForm } from "../form/update-category-form";
import { Badge } from "../ui/badge";
import { ActualBudgetItemResponse } from "@/models/response/item-actual.response";
import { AddActualBudgetItemForm } from "../form/create-actual-item-form";
import { UpdateActualBudgetItemForm } from "../form/update-actual-item-form";
import { DeleteActualBudgetItemModal } from "../form/delete-actual-item-form";

interface BudgetManagementAccordionProps {
    actualCategories: BudgetItemCategorySchema[];
    categoriesActualItems: Record<string, ActualBudgetItemResponse[]>;
    actualBudget: BudgetSchema | null;
    totalPriceMap: Record<string, number>;
    inventories: InventorySchema[];
    vendorServices: VendorServiceSchema[];
    handleAddActualBudget: (data: AddActualBudgetItemDTO) => void;
    handleUpdateActualBudgetItem: (data: UpdateActualBudgetItemDTO) => void;
    handleDeleteActualBudgetItem: (budgetItemId: string) => void;
    handleAddPurchasing: (data: AddPurchaseDTO) => void;
    handleUpdatePurchasing: (data: UpdatePurchaseDTO) => void;
    handleDeleteCategory: (categoryId: number, isActual: boolean) => void;
    handleUpdateCategory: (categoryId: number, data: UpdateBudgetItemCategoryDTO) => void;
}
export function ActualBudgetManagementAccordion({ 
  actualCategories,
  categoriesActualItems,
  actualBudget,
  totalPriceMap,
  inventories,
  vendorServices,
  handleAddActualBudget,
  handleUpdateActualBudgetItem,
  handleDeleteActualBudgetItem,
  handleDeleteCategory,
  handleUpdateCategory,
  handleAddPurchasing,
  handleUpdatePurchasing
}: BudgetManagementAccordionProps) {
  const formatToRupiah = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')},00`;
  };
  return (
      <>
        <Accordion type="multiple" defaultValue={["1"]}>
          {actualCategories.map((category) => (
            <AccordionItem key={category.category_id} value={category.category_name} className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-row items-center gap-2">
                    <span className="font-medium">
                      {category.category_name}
                    </span>
                      <UpdateBudgetItemCategoryForm
                        category={category}
                        onUpdateBudgetItemCategory={handleUpdateCategory}
                      />
                  </div>
                  <div className="flex items-center gap-8">
                        <span className="font-medium">{formatToRupiah(totalPriceMap[category.category_name])}</span>
                        <DeleteCategoryModal
                          onDeleteCategory={handleDeleteCategory}
                          categoryName={category.category_name}
                          categoryId={category.category_id}
                          is_actual={true}
                          trigger={
                              <X size={18} />
                          }
                        />
                      </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                {/* Table header */}
                <div className="grid grid-cols-8 gap-4 mb-2 border-b pb-2 font-bold">
                  <div className="col-span-1">Item</div>
                  <div className="col-span-1">Cost</div>
                  <div className="col-span-1">Quantity</div>
                  <div className="col-span-1">Subtotal</div>
                  <div className="col-span-1">Source</div>
                  <div className="col-span-1">Note</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 flex justify-end">
                      <AddActualBudgetItemForm
                        categoryId={category.category_id}
                        onAddActualBudgetItem={handleAddActualBudget}
                        onAddPurchasing={handleAddPurchasing} 
                        inventories={inventories}
                        vendorServices={vendorServices}
                        actualBudget={actualBudget}
                      />
                  </div>
                </div>
    
                {/* Table rows */}
                {categoriesActualItems[category.category_id].length === 0 ? (
                      <div className="py-8 text-center text-gray-500 italic">
                        No items added yet. Click the + button to add an item.
                      </div>
                    ) : (
                      categoriesActualItems[category.category_id].map((item) => (
                        <div
                          key={item.actual_budget_item_id}
                          className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50 rounded-md transition-colors"
                        >
                          {item.inventory_id ? (
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
                              <div className="col-span-1">
                                <div className="text-gray-800">{item.notes}</div>
                              </div>
                              <div className="col-span-1">
                                {item.status === "PENDING" ? (
                                  <Badge className="bg-warning text-super-white hover:bg-warning-light">
                                    Pending
                                  </Badge>
                                ) : item.status === "CANCELED" ? (
                                  <Badge className="bg-destructive text-super-white hover:bg-destructive-light">
                                    Rejected
                                  </Badge>
                                ):(
                                  <Badge className="bg-success text-super-white hover:bg-success-light">
                                    Approved
                                  </Badge>
                                )}
                                
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                  Approved
                                </Badge>
                              </div>
                              <div className="col-span-1 flex justify-end gap-2">
                                <UpdateActualBudgetItemForm
                                  onUpdateActualBudgetItem={handleUpdateActualBudgetItem}
                                  onUpdatePurchasing={handleUpdatePurchasing}
                                  categoryId={category.category_id}
                                  existingItem={item}
                                  inventories={inventories}
                                  vendorServices={vendorServices}
                                  currentSource="inventory"
                                />
                                <DeleteActualBudgetItemModal
                                  onDeleteActualItem={handleDeleteActualBudgetItem}
                                  budgetItemId={item.actual_budget_item_id}
                                />
                              </div>
                            </>
                          ) : item.vendor_service_id ? (
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
                                <UpdateActualBudgetItemForm
                                  onUpdateActualBudgetItem={handleUpdateActualBudgetItem}
                                  onUpdatePurchasing={handleUpdatePurchasing}
                                  categoryId={category.category_id}
                                  existingItem={item}
                                  inventories={inventories}
                                  vendorServices={vendorServices}
                                  currentSource="inventory"
                                />
                                <DeleteActualBudgetItemModal
                                  onDeleteActualItem={handleDeleteActualBudgetItem}
                                  budgetItemId={item.actual_budget_item_id}
                                />
                              </div>
                            </>
                          ) : item.other_item_id ? (
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
                                <UpdateActualBudgetItemForm
                                  onUpdateActualBudgetItem={handleUpdateActualBudgetItem}
                                  onUpdatePurchasing={handleUpdatePurchasing}
                                  categoryId={category.category_id}
                                  existingItem={item}
                                  inventories={inventories}
                                  vendorServices={vendorServices}
                                  currentSource="inventory"
                                />
                                <DeleteActualBudgetItemModal
                                  onDeleteActualItem={handleDeleteActualBudgetItem}
                                  budgetItemId={item.actual_budget_item_id}
                                />
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
