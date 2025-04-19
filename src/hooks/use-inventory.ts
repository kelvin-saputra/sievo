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
        const validatedInventories = rawInventories.map((ev: unknown) => InventorySchema.parse(ev));
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
    data: UpdateInventoryDTO
  ) => {
    try {
      // Fetch semua inventaris terlebih dahulu untuk mengecek apakah ada duplikasi
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
  
      // Mengecek apakah ada duplikasi nama item yang sedang diupdate
      const isDuplicate = existingInventories.some(
        (item: InventorySchema) =>
          item.item_name.toLowerCase() === data.item_name?.toLowerCase() &&
          item.inventory_id !== inventoryId // Jangan cek duplikasi untuk item yang sedang diupdate
      );
  
      if (isDuplicate) {
        toast.error("Item name already exists. Please choose a different name.");
        return;
      }
  
      // Persiapkan data untuk request PUT
      const updatedData = InventorySchema.partial().parse({
        ...data,
        inventoryId: inventoryId,
        updated_by: "550e8400-e29b-41d4-a716-446655440000", // Gunakan ID yang sesuai dari login
        updated_at: new Date(),
      });
  
      // Kirim request PUT untuk update inventory
      const { data: updatedInventory } = await axios.put(
        `${API_URL}/${inventoryId}`,
        updatedData
      );
      const parsedInventory = InventorySchema.parse(updatedInventory.data);
  
      // Update state inventories setelah data berhasil diperbarui
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
      await axios.delete(`${API_URL}/${inventoryId}`);
      setInventorys((prevInventorys) =>
        prevInventorys.filter((ev) => ev.inventory_id !== inventoryId)
      );
      toast.success("Inventory berhasil dihapus!");
    } catch {
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
        (item: InventorySchema) => item.item_name.toLowerCase() === newInventory.item_name.toLowerCase()
      );

      if (isDuplicate) {
        toast.error("Item name already exists. Please choose a different name.");
        return;
      }

      const InventoryData = InventorySchema.partial().parse({
        ...newInventory,
        created_by: "550e8400-e29b-41d4-a716-446655440000",
        updated_by: "550e8400-e29b-41d4-a716-446655440000",
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
