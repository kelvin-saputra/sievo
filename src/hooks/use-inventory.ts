"use client"
import { useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { InventorySchema } from "@/models/schemas";
import { AddInventoryDTO, UpdateInventoryDTO } from "@/models/dto";
import { InventoryCategoryEnum } from "@/models/enums";


const API_URL = process.env.NEXT_PUBLIC_INVENTORY_API_URL!;

export default function useInventory() {
  const [inventory, setInventory] = useState<InventorySchema | null>(null);
  const [inventories, setInventorys] = useState<InventorySchema[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllInventories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const rawInventories = response.data.data;
      if (Array.isArray(rawInventories)) {
        const validatedInventories = rawInventories
          .filter((item: InventorySchema) => !item.is_deleted) 
          .map((ev: unknown) => InventorySchema.parse(ev));
        setInventorys(validatedInventories);
      } else {
        console.warn("Expected an array but received:", rawInventories);
        setInventorys([]);
      }
    } catch {
      toast.error("Gagal mengambil data Inventory.");
    }
    setLoading(false);
  }, []);
  

  const fetchInventoryById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      setInventory(InventorySchema.parse(data.data));
    } catch {
      toast.error("Gagal mengambil Inventory.");
    }
    setLoading(false);
  }, []);

  const handleUpdateInventory = async (
    inventoryId: string,
    data: UpdateInventoryDTO,
    user_id: string
  ) => {
    try {
      console.log(user_id)
      const response = await axios.get(API_URL);
      if (response.status !== 200) {
        toast.error("Failed to fetch existing inventories: " + response.data.message);
        return;
      }
  
      const existingInventories = response.data.data || [];
      if (!Array.isArray(existingInventories)) {
        toast.error("Failed to fetch existing inventories.");
        return;
      }
  
      const currentInventory = existingInventories.find(
        (item: InventorySchema) => item.inventory_id === inventoryId
      );
  
      if (!currentInventory) {
        toast.error("Inventory not found.");
        return;
      }
  
      if (data.item_qty !== undefined && data.item_qty < currentInventory.item_qty) {
        toast.error("New quantity cannot be less than the current quantity.");
        return;
      }
  
      const totalReservedAndDamaged = (data.item_qty_reserved ?? 0) + (data.item_qty_damaged ?? 0);
      if (data.item_qty !== undefined && data.item_qty < totalReservedAndDamaged) {
        toast.error("Quantity cannot be less than the sum of reserved and damaged quantities.");
        return;
      }
  
      if (data.item_qty_reserved !== undefined && data.item_qty !== undefined && data.item_qty_reserved > data.item_qty) {
        toast.error("Reserved quantity cannot exceed total quantity.");
        return;
      }
  
      if (data.item_qty_damaged !== undefined && data.item_qty !== undefined && data.item_qty_damaged > data.item_qty) {
        toast.error("Damaged quantity cannot exceed total quantity.");
        return;
      }
  
      const isDuplicate = existingInventories.some(
        (item: InventorySchema) =>
          item.item_name.toLowerCase() === data.item_name?.toLowerCase() &&
          item.inventory_id !== inventoryId &&
          !item.is_deleted // Exclude soft-deleted items
      );
  
      if (isDuplicate) {
        toast.error("Item name already exists. Please choose a different name.");
        return;
      }
  
      const updatedData = InventorySchema.partial().parse({
        ...data,
        inventoryId: inventoryId,
        updated_by: user_id, 
        updated_at: new Date(),
      });
  
      const { data: updatedInventory } = await axios.put(
        `${API_URL}/${inventoryId}`,
        updatedData
      );
      const parsedInventory = InventorySchema.parse(updatedInventory.data);
      setInventorys((prevInventorys) =>
        prevInventorys.map((ev) =>
          ev.inventory_id === inventoryId ? parsedInventory : ev
        )
      );
      if (inventory?.inventory_id === inventoryId) {
        setInventory(parsedInventory);
      }
  
      toast.success("Inventory berhasil diperbarui!");
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast.error("Gagal memperbarui Inventory.");
    }
  };
  

  const handleDeleteInventory = async (inventoryId: string) => {
    try {
      console.log("Attempting to delete inventory with ID:", inventoryId);
  
      const response = await axios.delete(`${API_URL}/${inventoryId}`);
  
      if (response.status === 200) {
          setInventorys((prevInventorys) =>
          prevInventorys.filter((ev) => ev.inventory_id !== inventoryId)
        );

        toast.success("Inventory berhasil dihapus!");
      } else {
        console.error("Failed to delete inventory:", response);
        toast.error("Gagal menghapus Inventory.");
      }

    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error("Gagal menghapus Inventory.");
    }
  };
  
  

  const handleCategoryChange = async (
    inventoryId: string,
    newStatus: InventoryCategoryEnum
  ) => {
    try {
      const { data: updatedInventory } = await axios.put(
        `${API_URL}/${inventoryId}/status`,
        { status: newStatus }
      );

      const parsedInventory = InventorySchema.parse(updatedInventory.Inventory);
      setInventorys((prevInventorys) =>
        prevInventorys.map((ev) => (ev.inventory_id === inventoryId ? parsedInventory : ev))
      );
      if (inventory?.inventory_id === inventoryId) {
        setInventory(parsedInventory);
      }
    } catch {
      toast.error("Gagal memperbarui status Inventory.");
    }
    setLoading(false);
  };

  const handleAddInventory = async (newInventory: AddInventoryDTO) => {
    try {
      const response = await axios.get(API_URL);
      if (response.status !== 200) {
        toast.error("Failed to fetch existing inventories: " + response.data.message);
        return;
      }

      const existingInventories = response.data.data || [];
      if (!Array.isArray(existingInventories)) {
        toast.error("Failed to fetch existing inventories.");
        return;
      }

      const isDuplicate = existingInventories.some(
        (item: InventorySchema) => 
          item.item_name.toLowerCase() === newInventory.item_name.toLowerCase() &&
          !item.is_deleted // Exclude soft-deleted items
      );

      if (isDuplicate) {
        toast.error("Item name already exists. Please choose a different name.");
        return;
      }

      const InventoryData = InventorySchema.partial().parse({
        ...newInventory,
      });

      const { data: createdInventory } = await axios.post(API_URL, InventoryData);
      const parsedInventory = InventorySchema.parse(createdInventory.data);

      setInventorys((prevInventorys) => [...prevInventorys, parsedInventory]);
      toast.success("Inventory berhasil ditambahkan!");
    } catch {
      toast.error("Gagal menambahkan Inventory.");
    }
  };


  return {
    inventory,
    inventories,
    loading,
    fetchAllInventories,
    fetchInventoryById,
    handleUpdateInventory,
    handleDeleteInventory,
    handleCategoryChange,
    handleAddInventory,
  };
}