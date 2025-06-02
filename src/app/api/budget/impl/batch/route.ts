import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {event_id:eventId, ...reqBody} = await req.json();

        const budgetActual = await prisma.budget.findFirst({
            where: { event_id: eventId, is_actual: true },
        });

        if (reqBody.status !== "APPROVED" && reqBody.is_deleted) {
            return responseFormat(400, `Failed to import budget, Budget Plan is not Approved!`, null);
        }

        const importedBudget = await prisma.$transaction(async (transactions) => {
            const results: any[] = [];
          
            for (const cat of Object.values(reqBody.categories) as any[]) {
              const newCategory = await transactions.budgetItemCategory.create({
                data: {
                  category_name: cat.category_name,
                  is_deleted: false,
                  budget: { connect: { budget_id: budgetActual?.budget_id } },
                },
              });
      
              for (const item of cat.budget_plan_item) {
                let otherConnect: { other_item: { connect: { other_item_id: string } } } | undefined;
                if (item.other_item) {
                  const createdOther = await transactions.purchasing.create({
                    data: {
                      item_name:    item.other_item.item_name,
                      item_price:   item.other_item.item_price,
                      description:  item.other_item.description,
                      created_by:   item.other_item.created_by,
                      is_deleted:   false,
                    },
                  });
                  otherConnect = { other_item: { connect: { other_item_id: createdOther.other_item_id } } };
                }
      
                // Data for Actual Budget Item
                const data: any = {
                  item_qty:      item.item_qty,
                  item_subtotal: item.item_subtotal,
                  is_deleted:    false,
                  budget:        { connect: { budget_id: budgetActual?.budget_id } },
                  category:      { connect: { category_id: newCategory.category_id } },
                  
                  // Connect to Item 
                  ...(item.vendor_service_id && {
                    vendor_service: { connect: { service_id: item.vendor_service_id } },
                  }),
                  ...(item.inventory_id && {
                    inventory: { connect: { inventory_id: item.inventory_id } },
                  }),
                  ...(otherConnect ?? {}),
                };
      
                // Create the Item for Actual budget
                const newActual = await transactions.actualBudgetItem.create({ data });
                results.push(newActual);
              }
            }
      
            return results;
          });
        return responseFormat(200, "Budget Import is Successful!", importedBudget);
    } catch {
        return responseFormat(500, "There's something wrong when importing budget!", null);
    }
}