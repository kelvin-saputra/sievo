// src/context/event-context.tsx
import { createContext } from "react";
import { ContactSchema, EventSchema, InventorySchema, PurchasingSchema, TaskSchema } from "@/models/schemas";
import { UpdateEventDTO } from "@/models/dto/event.dto";
import { UpdateTaskDTO, AddTaskDTO, AddBudgetPlanItemDTO, UpdateBudgetPlanItemDTO, AddBudgetItemCategoryDTO, AddActualBudgetItemDTO, UpdateActualBudgetItemDTO, AddPurchaseDTO, UpdatePurchaseDTO, UpdateBudgetItemCategoryDTO, UpdateBudgetDTO } from "@/models/dto";
import { EventStatusEnum } from "@/models/enums";
import { UserWithStatus } from "@/hooks/use-hr";
import { BudgetWithCategoryBudgetPlan } from "../response/budget-with-category-budget-plan";
import { BudgetWithCategoryBudgetActual } from "../response/budget-with-category-budget-actual";
import { VendorWithService } from "../response/vendor-with-service";

interface EventContextType {
  event: EventSchema;
  tasks: TaskSchema[];
  userAssigned: UserWithStatus[];
  client?: ContactSchema | null;
  manager?: UserWithStatus | null;

  // BUDGETS
  budgetPlanData: BudgetWithCategoryBudgetPlan | null;
  budgetActualData: BudgetWithCategoryBudgetActual | null;

  // INVENTORY
  inventories: InventorySchema[];

  // VENDORSERVICE
  vendorServices: VendorWithService[];

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

  // BUDGETS
  fetchBudgetDataPlan: () => Promise<void>;
  fetchBudgetDataActual: () => Promise<void>;
  handleUpdateBudgetPlanStatus: (data:UpdateBudgetDTO) => Promise<void>;

  // BUDGETTING PLAN
  handleAddBudgetPlanItem: (data: AddBudgetPlanItemDTO) => Promise<void>;
  handleDeleteBudgetPlanItem: (budgetPlanItemId: string) => Promise<void>;
  handleUpdateBudgetPlanItem: (data: UpdateBudgetPlanItemDTO) => Promise<void>;

  // BUDGETTING ACTUAL
  handleAddActualBudgetItem: (data: AddActualBudgetItemDTO) => Promise<void>;
  handleDeleteActualBudgetItem: (actualBudgetItemId: string) => Promise<void>;
  handleUpdateActualBudgetItem: (data: UpdateActualBudgetItemDTO) => Promise<void>;
  handleImportBudgetData: () => Promise<void>;

  // BUDGET CATEGORIES
  handleAddCategory: (is_actual: boolean, data: AddBudgetItemCategoryDTO) => Promise<void>;
  handleUpdateCategory: (categoryId: number, data: UpdateBudgetItemCategoryDTO) => Promise<void>;
  handleDeleteCategory: (categoryId: number, is_actual: boolean) => Promise<void>;

  // INVENTORY
  fetchAllInventories: () => Promise<void>;

  // VENDOR SERVICE
  fetchAllVendorServices: () => Promise<void>;

  // PURCHASING
  handleAddPurchase: (data: AddPurchaseDTO) => Promise<void>;
  handleUpdatePurchase: (data: UpdatePurchaseDTO) => Promise<PurchasingSchema|undefined>;
  handleDeletePurchase: (purchaseId: string) => Promise<void>;
  
  refetchAll: () => void;
}

const EventContext = createContext<EventContextType | null>(null);

export default EventContext;
