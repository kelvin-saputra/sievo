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
import { DeleteInventoryModal } from "@/components/inventory/delete-inventory-modal";
import { EditInventoryModal } from "@/components/inventory/edit-inventory-modal";
import { useState } from "react";
import PageHeader from "@/components/common/page-header";

const ItemDetail = () => {
  const { itemId } = useParams();
  const { inventory, loading, fetchInventoryById } = useInventory(); 
  const [open, setOpen] = useState(false);
  
  React.useEffect(() => {
    if (Array.isArray(itemId)) {
      // If itemId is an array, take the first element
      fetchInventoryById(itemId[0]);
    } else if (typeof itemId === "string") {
      // If itemId is a string, use it directly
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
    <div className="bg-white min-h-screen p-6 w-full max-w-7xl mx-auto">
      <div>
        <PageHeader
          title="Inventory Overview"
        />
      <div className="my-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <p className="text-muted-foreground text-2xl">Item Detail</p>
          <div className="grid grid-cols-2 gap-x-4">
            <EditInventoryModal
                inventory={inventory}
                onUpdateInventory={(data) => console.log("Updated Data:", data)}
                open={open}
                setOpen={setOpen}
              />
              <DeleteInventoryModal
                inventoryId={inventory.inventory_id}
                onDeleteInventory={(id) => console.log("Deleted Data:", id)}
                open={open}
                setOpen={setOpen}
              />
          </div>
        </div>
        <div className="grid grid-cols-2 my-16">
          <div className="mx-10">
          <Carousel className="w-full max-w-lg">
            <CarouselContent>
              {Array.isArray(inventory.inventory_photo) && inventory.inventory_photo.length > 0 ? (
                inventory.inventory_photo.map((photo, index) => (
                  <CarouselItem key={index} className="w-full">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <AspectRatio ratio={16 / 9}>
                            <Image
                              src={photo}
                              alt={`Inventory Image ${index + 1}`}
                              width={500}
                              height={500}
                              className="rounded-md object-cover w-full h-full"
                              />
                          </AspectRatio>
                        </CardContent>
                      </Card>
                    </div>
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
          <div className="mx-10">
            <h1 className="text-4xl font-bold">{inventory.item_name}</h1>
            <div>
              <div className="flex justify-between my-5">
                <div><p>Quantity</p></div>
                <div><p>{inventory.item_qty}</p></div>
              </div>
              <Separator />
              <div className="flex justify-between my-5">
                <div><p>Price</p></div>
                <div><p>{inventory.item_price}</p></div>
              </div>
              <Separator />
              <div className="flex justify-between my-5">
                <div><p>Status</p></div>
                <div>
                  <Badge variant={inventory.is_avail ? "default" : "destructive"}>
                    {inventory.is_avail ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between my-5">
                <div><p>Category</p></div>
                <div><Badge variant="secondary">{inventory.category}</Badge></div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-16">
          <Tabs defaultValue="description" className="container">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="changelog">Change Log</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              {inventory.description}
            </TabsContent>
            <TabsContent value="changelog">
              {/* <div className="space-y-2 flex-col">
                {inventory.change_log.map((log, index) => (
                  <p key={index}>
                    {log.date} — <span className="text-muted-foreground">{log.updated_by}</span>
                  </p>
                ))}
              </div> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;