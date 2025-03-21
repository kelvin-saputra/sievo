import { createContext } from "react";
import { InventorySchema } from "@/models/schemas";
import { UpdateInventoryDTO } from "@/models/dto/inventory.dto";
import { InventoryCategoryEnum } from "@/models/enums";

interface InventoryContextType {
  inventory: InventorySchema;
  loading: boolean;

  handleUpdateInventory: (
    inventoryId: string,
    createdBy: string,
    data: UpdateInventoryDTO
  ) => Promise<void>;
  handleDeleteInventory: (inventoryId: string) => Promise<void>;
  handleCategoryChange: (inventoryId: string, status: InventoryCategoryEnum) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export default InventoryContext;
