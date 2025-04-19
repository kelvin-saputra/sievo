"use client";

import { useParams } from "next/navigation";
import * as React from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useInventory from "@/hooks/use-inventory"; 
import { DeleteInventoryModal } from "@/components/inventory/form/delete-inventory-modal";
import { EditInventoryModal } from "@/components/inventory/form/edit-inventory-modal";
import { useState } from "react";

const ItemDetail = () => {
  const { itemId } = useParams();

  const { inventory, loading, fetchInventoryById, handleDeleteInventory, handleUpdateInventory } = useInventory(); 
  const [open, setOpen] = useState(false);
  
  React.useEffect(() => {
    if (Array.isArray(itemId)) {
      fetchInventoryById(itemId[0]);
    } else if (typeof itemId === "string") {
      fetchInventoryById(itemId);
    }
  }, [itemId, fetchInventoryById]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!inventory) {
    return <div>Inventory not found.</div>;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-start px-4 sm:px-8 md:px-16 lg:px-24 py-12 ">
      <p className="text-4xl sm:text-5xl font-bold mb-6 text-center justify-self-start">Inventory</p>
      <Separator className="w-full" />
      <div className="w-full my-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start w-full">
          <p className="text-muted-foreground text-xl sm:text-2xl">Item Detail</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <EditInventoryModal inventory={inventory} onUpdateInventory={handleUpdateInventory} open={open} setOpen={setOpen} />
            <DeleteInventoryModal inventoryId={inventory.inventory_id} onDeleteInventory={(id) => console.log("Deleted Data:", id)} open={open} setOpen={setOpen} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10 w-full">
        <div className="md:col-span-1">
          <Carousel className="w-full max-w-sm">
            <CarouselContent>
              {Array.isArray(inventory.inventory_photo) && inventory.inventory_photo.length > 0 ? (
                inventory.inventory_photo.map((photo, index) => (
                  <CarouselItem key={index}>
                    <Card className="justify-center">
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                        <AspectRatio ratio={1 / 1}>
                          <Image src={photo} alt={`Inventory Image ${index + 1}`} width={300} height={300} className="rounded-md object-cover" />
                        </AspectRatio>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <p>No images available</p>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        <div className="md:col-span-2">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{inventory.item_name}</h1>
          <div className="space-y-4">
            <div className="flex justify-between"><p>Quantity</p><p>{inventory.item_qty}</p></div>
            <Separator />
            <div className="flex justify-between"><p>Price</p><p>{inventory.item_price}</p></div>
            <Separator />
            <div className="flex justify-between"><p>Status</p><Badge variant={inventory.is_avail ? "default" : "destructive"}>{inventory.is_avail ? "Available" : "Unavailable"}</Badge></div>
            <Separator />
            <div className="flex justify-between"><p>Category</p><Badge variant="secondary">{inventory.category}</Badge></div>
          </div>
        </div>
      </div>
      
      <div className="my-12 w-full max-w-5xl">
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="changelog">Change Log</TabsTrigger>
          </TabsList>
          <TabsContent value="description">{inventory.description}</TabsContent>
          <TabsContent value="changelog"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ItemDetail;