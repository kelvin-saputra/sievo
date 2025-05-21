import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ event_id: string }> }
) {
  const { params } = context;

  try {
    const data = await req.json();
    const { status, updated_by } = data;

    const updatedEvent = await prisma.$transaction(async (transactions) => {

      if (status === "DONE") {
        console.log("Event status is DONE");
        const budgetPlan = await transactions.budget.findFirst({
          where: {
            event_id: (await params).event_id,
            is_deleted: false,
          },
          include: {
            plan_item: {
              where: {
                is_deleted: false,
              },
              include: {
                inventory: {
                  where: {
                    is_deleted: false,
                  },
                },
              }
            },
          },
        });
        const budgetActual = await transactions.budget.findFirst({
          where: {
            event_id: (await params).event_id,
            is_deleted: false,
          },
          include: {
            actual_item: {
              where: {
                is_deleted: false,
              },
              include: {
                inventory: {
                  where: {
                    is_deleted: false,
                  },
                },
              }
            }
          },
        });
  
        const inventoryItems: {
          inventory_id: string;
          item_qty: number;
        }[] = [];
  
        if (budgetActual && budgetActual.actual_item) {
          budgetActual.actual_item.forEach(item => {
            if (item.inventory) {
              inventoryItems.push({
                inventory_id: item.inventory.inventory_id,
                item_qty: item.item_qty || 0,
              });
            }
          });
        }
  
        if (budgetPlan && budgetPlan.plan_item) {
          budgetPlan.plan_item.forEach(item => {
            if (item.inventory) {
              const existingItem = inventoryItems.find(
                existing => existing.inventory_id === item.inventory_id
              );
              
              if (!existingItem) {
                inventoryItems.push({
                  inventory_id: item.inventory.inventory_id,
                  item_qty: item.item_qty || 0,
                });
              }
            }
          });
        }
        for (const item of inventoryItems) {
          const inventory = await transactions.inventory.findUnique({
            where: {
              inventory_id: item.inventory_id,
            },
          });
  
          if (inventory) {
            await transactions.inventory.update({
              where: {
                inventory_id: item.inventory_id,
              },
              data: {
                item_qty_reserved: inventory.item_qty_reserved - item.item_qty,
                updated_by,
                updated_at: new Date(),
              },
            });
          }
        }
      }
  
      const updatedEvent = await transactions.event.update({
        where: {
          event_id: (await params).event_id,
          is_deleted: false,
        },
        data: {
          status,
          updated_by,
          updated_at: new Date(),
        },
      });
      return updatedEvent;
    });

    return NextResponse.json({
      message: `Status event berhasil diperbarui menjadi ${status}`,
      event: updatedEvent,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal memperbarui status event",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
