// src/context/event-context.tsx
import { createContext } from "react";
import { BudgetItemCategorySchema, BudgetSchema, EventSchema, InventorySchema, TaskSchema, VendorServiceSchema } from "@/models/schemas";
import { UpdateEventDTO } from "@/models/dto/event.dto";
import { UpdateTaskDTO, AddTaskDTO, AddBudgetPlanItemDTO, UpdateBudgetPlanItemDTO, AddBudgetItemCategoryDTO, AddActualBudgetItemDTO, UpdateActualBudgetItemDTO, AddPurchaseDTO, UpdatePurchaseDTO, UpdateBudgetItemCategoryDTO } from "@/models/dto";
import { EventStatusEnum } from "@/models/enums";
import { BudgetItemPlanResponse } from "../response/item-plan.response";
import { ActualBudgetItemResponse } from "../response/item-actual.response";

interface EventContextType {
  event: EventSchema;
  tasks: TaskSchema[];
  // BUDGETTING
  budgetPlan: BudgetSchema | null;
  actualBudget: BudgetSchema | null;
  budgetPlanItems: BudgetItemPlanResponse[];
  actualBudgetItems: ActualBudgetItemResponse[];
  // BUDGET CATEGORIES
  categoriesPlan: BudgetItemCategorySchema[];
  actualCategories: BudgetItemCategorySchema[];

  // INVENTORY
  inventories: InventorySchema[];

  // VENDORSERVICE
  vendorServices: VendorServiceSchema[];

  // LOADING
  loading: boolean;

  // EVENT
  handleUpdateEvent: (
    eventId: string,
    createdBy: string,
    data: UpdateEventDTO
  ) => Promise<void>;
  handleDeleteEvent: (eventId: string) => Promise<void>;
  handleStatusChange: (eventId: string, status: EventStatusEnum) => void;

  // TASK
  fetchAllTasks: () => Promise<void>;
  fetchTaskById: (taskId: string) => Promise<void>;
  handleUpdateTask: (
    taskId: string,
    created_by: string,
    data: UpdateTaskDTO
  ) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  handleAddTask: (data: AddTaskDTO) => Promise<void>;
  
  // BUDGETTING PLAN
  fetchBudgetPlan: () => Promise<void>;
  fetchAllBudgetPlanItems: () => Promise<void>;
  handleAddBudgetPlanItem: (data: AddBudgetPlanItemDTO) => Promise<void>;
  handleDeleteBudgetPlanItem: (budgetPlanItemId: string) => Promise<void>;
  handleUpdateBudgetPlanItem: (data:UpdateBudgetPlanItemDTO) => Promise<void>;

  // BUDGETTING ACTUAL
  fetchActualBudget: () => Promise<void>;
  fetchAllActualBudgetItems: () => Promise<void>;
  handleAddActualBudgetItem: (data: AddActualBudgetItemDTO) => Promise<void>;
  handleDeleteActualBudgetItem: (actualBudgetItemId: string) => Promise<void>;
  handleUpdateActualBudgetItem: (data: UpdateActualBudgetItemDTO) => Promise<void>;
  handleImportBudgetData: () => Promise<void>;

  // BUDGET CATEGORIES PLAN
  fetchCategoriesByBudgetIdPlan: () => Promise<void>;
  
  // BUDGET CATEGORIES ACTUAL
  fetchCategoriesByActualBudgetId: () => Promise<void>;
  
  // BUDGET CATEGORIES
  handleAddCategory: (is_actual:boolean, data: AddBudgetItemCategoryDTO) => Promise<void>;
  handleUpdateCategory: (categoryId: number, data: UpdateBudgetItemCategoryDTO) => Promise<void>;
  handleDeleteCategory: (categoryId: number, is_actual:boolean) => Promise<void>;

  // INVENTORY
  fetchAllInventories: () => Promise<void>;

  // VENDOR SERVICE
  fetchAllVendorServices: () => Promise<void>;

  // PURCHASING
  handleAddPurchase: (data: AddPurchaseDTO) => void;
  handleUpdatePurchase: (data: UpdatePurchaseDTO) => void;
  handleDeletePurchase: (purchaseId: string) => void;
}

const EventContext = createContext<EventContextType | null>(null);

export default EventContext;
