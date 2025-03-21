import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

export async function POST(req:Request){
    try {
        const {event_id:eventId, ...reqBody} = await req.json();


        console.log(reqBody);

        const budgets = await prisma.budget.findFirst({
            where: { event_id: eventId, is_actual: true },
        });

        const importedBudget = await prisma.$transaction( async (transactions) => {

            await Promise.all(Object.values(reqBody).map(async (budget: any) => {
                    let budgetItem;
                    console.log("Iterasi ",budget)
                    const category = await transactions.budgetItemCategory.create({
                        data: {
                            category_name: budget.category.category_name,
                            is_deleted: false
                        }
                    });

                    if (budget.vendor_service_id !== null) {
                        budgetItem = await transactions.actualBudgetItem.create({
                            data: {
                                item_qty: budget.item_qty,
                                item_subtotal: budget.item_subtotal,
                                is_deleted: false, 
                                budget: {
                                    connect: {
                                        budget_id: budgets?.budget_id
                                    }
                                },
                                category: {
                                    connect: {
                                        category_id: category.category_id
                                    }
                                },
                                vendor_service: {
                                    connect: {
                                        service_id: budget.vendor_service_id
                                    }
                                },
                            }
                        });
                        await transactions.budgetItemCategory.update({
                            where: { category_id: category.category_id },
                            data: {
                                budget: {
                                    connect: { budget_id: budgets?.budget_id }
                                },
                                actual_budget_item: {
                                    connect: { actual_budget_item_id: budgetItem?.actual_budget_item_id }
                                }
                            }
                        })
                    } 
                    if (budget.inventory_id !== null) {
                        budgetItem = await transactions.actualBudgetItem.create({
                            data: {
                                item_qty: budget.item_qty,
                                item_subtotal: budget.item_subtotal,
                                is_deleted: false, 
                                budget: {
                                    connect: {
                                        budget_id: budgets?.budget_id
                                    }
                                },
                                category: {
                                    connect: {
                                        category_id: category.category_id
                                    }
                                },
                                inventory: {
                                    connect: {
                                        inventory_id: budget.inventory_id
                                    }
                                },
                            }
                        });
                        await transactions.budgetItemCategory.update({
                            where: { category_id: category.category_id },
                            data: {
                                budget: {
                                    connect: { budget_id: budgets?.budget_id }
                                },
                                actual_budget_item: {
                                    connect: { actual_budget_item_id: budgetItem?.actual_budget_item_id }
                                }
                            }
                        })
                    }
                    
                    if (budget.other_item_id !== null) {
                        const otherItem = await transactions.purchasing.create({
                            data: {
                                item_name: budget.other_item.item_name,
                                item_price: budget.other_item.item_price,
                                description: budget.other_item.description,
                                created_by: budget.other_item.created_by,
                                is_deleted: false,
                            }
                        })
                        budgetItem = await transactions.actualBudgetItem.create({
                            data: {
                                item_qty: budget.item_qty,
                                item_subtotal: budget.item_subtotal,
                                is_deleted: false, 
                                budget: {
                                    connect: {
                                        budget_id: budgets?.budget_id
                                    }
                                },
                                category: {
                                    connect: {
                                        category_id: category.category_id
                                    }
                                },
                                other_item: {
                                    connect: {
                                       other_item_id : budget.other_item_id
                                    }
                                },
                            }
                        });

                        await transactions.purchasing.update({
                            where: { other_item_id: otherItem.other_item_id },
                            data: {
                                actual_budget_item: {
                                    connect: {
                                        actual_budget_item_id: budgetItem?.actual_budget_item_id
                                    }
                                }
                            }
                        })
                        await transactions.budgetItemCategory.update({
                            where: { category_id: category.category_id },
                            data: {
                                budget: {
                                    connect: { budget_id: budgets?.budget_id }
                                },
                                actual_budget_item: {
                                    connect: { actual_budget_item_id: budgetItem?.actual_budget_item_id }
                                }
                            }
                        })
                    }
                }));
            });
        return responseFormat(200, "Berhasil mendapatkan data budget", importedBudget);
    } catch (error) {
        console.log(error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal mendapatkan data budget", null);
    }
}