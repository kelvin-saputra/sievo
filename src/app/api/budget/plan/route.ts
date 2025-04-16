import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();
        const { category_id:categoryId, budget_id:budgetId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, ...planData } = reqBody;
        let vendorService, inventory, purchasing;

        if (serviceId) {
            vendorService = await prisma.vendorService.findFirst({
                where: { service_id: serviceId, is_deleted: false },
            });
        }
        if (inventoryId) {
            inventory = await prisma.inventory.findFirst({
                where: { inventory_id: inventoryId, is_deleted: false },
            });
        }
        if (purchasingId) {
            purchasing = await prisma.purchasing.findFirst({
                where: { other_item_id: purchasingId, is_deleted: false },
            });
        }
        
        if (!vendorService && !inventory && !purchasing) {
            return responseFormat(404, "Data item tidak ditemukan", null);
        }
        
        const budgetPlanItem = await prisma.$transaction(async (transactions) => {   
            let budgetPlan;       
            if (serviceId) {
                budgetPlan = await transactions.budgetPlanItem.create({
                    data: {
                        ...planData,
                        vendor_service: {connect: {service_id: serviceId}},
                        category: {connect: {category_id: categoryId}},
                        budget: {connect: {budget_id: budgetId}},
                    },
                    include: {
                        category: true,
                        vendor_service: true,
                        inventory: true,
                        other_item: true,
                    }
                });
                await transactions.vendorService.update({
                    where: { service_id: serviceId },
                    data: {
                        budget_plan_item: {
                            connect: { budget_item_id: planData.budget_item_id },
                        }
                    },
                });
            }

            if (inventoryId) {
                budgetPlan = await transactions.budgetPlanItem.create({
                    data: {
                        ...planData,
                        inventory: {connect: {inventory_id: inventoryId}},
                        category: {connect: {category_id: categoryId}},
                        budget: {connect: {budget_id: budgetId}},
                    },
                    include: {
                        category: true,
                        vendor_service: true,
                        inventory: true,
                        other_item: true,
                    }
                });
                await transactions.inventory.update({
                    where: { inventory_id: inventoryId },
                    data: {
                        budget_plan_item: {
                            connect: {budget_item_id: planData.budget_item_id} 
                        },
                    }
                });
            }
            
            if (purchasingId) {
                budgetPlan = await transactions.budgetPlanItem.create({
                    data: {
                        ...planData,
                        other_item: {connect: {other_item_id: purchasingId}},
                        category: {connect: {category_id: categoryId}},
                        budget: {connect: {budget_id: budgetId}},
                    },
                    include: {
                        category: true,
                        vendor_service: true,
                        inventory: true,
                        other_item: true,
                    }
                });
                await transactions.purchasing.update({
                    where: { other_item_id: purchasingId },
                    data: {
                        budget_plan_item: {
                            connect: { budget_item_id: planData.budget_item_id}
                        },
                    }
                });
            }
            // Connectiong Categories eith BudgetItem
            await transactions.budgetItemCategory.update({
                where: { category_id: categoryId, is_deleted: false },
                data: {
                    budget_plan_item: {
                        connect: { budget_item_id: budgetPlan?.budget_item_id },
                    },
                },
            });

            // Connecting Budget Plan With Budget Plan Item
            await transactions.budget.update({
                where: { budget_id: budgetPlan?.budget_id ?? undefined, is_deleted: false },
                data: {
                    plan_item: {
                        connect: { budget_item_id: budgetPlan?.budget_item_id },
                    },
                },
            });

            return budgetPlan;
        });
            if (!budgetPlanItem) {
                return responseFormat(400, "Rencana anggaran gagal dibuat", null);
            }
            return responseFormat(201, "Rencana anggaran berhasil dibuat", budgetPlanItem);
    } catch {
        return responseFormat(500, "Gagal membuat rencana anggaran", null);
    }
}

export async function DELETE(req: Request) {
    try {
        const reqBody = await req.json();
        const { budget_item_id } = reqBody;
        
        const deletedBudgetItem = await prisma.$transaction(async (transactions) => {
            const budgetPlan = await transactions.budgetPlanItem.update({
                where: { budget_item_id: budget_item_id, is_deleted: false },
                data: { is_deleted: true },
                include: {
                    category: true,
                    vendor_service: true,
                    inventory: true,
                    other_item: true,
                },
            });
            
            if (budgetPlan.vendor_service_id) {
                await transactions.vendorService.update({
                    where: { service_id: budgetPlan.vendor_service_id },
                    data: {
                        budget_plan_item: {
                            disconnect: { budget_item_id: budget_item_id },
                        },
                    },
                });
            }
            if (budgetPlan.inventory_id) {
                await transactions.inventory.update({
                    where: { inventory_id: budgetPlan.inventory_id },
                    data: {
                        budget_plan_item: {
                            disconnect: { budget_item_id: budget_item_id },
                        },
                    },
                });
            }
            if (budgetPlan.other_item_id) {
                await transactions.purchasing.update({
                    where: { other_item_id: budgetPlan.other_item_id },
                    data: {
                        budget_plan_item: {
                            disconnect: { budget_item_id: budget_item_id },
                        },
                        is_deleted: true,
                    },
                });
            }

            await transactions.budget.update({
                where: { budget_id: budgetPlan.budget_id! },
                data: {
                    plan_item: {
                        disconnect: { budget_item_id: budget_item_id },
                    },
                },
            });

            return budgetPlan;

        });
        if (!deletedBudgetItem) {
            return responseFormat(404, "Rencana anggaran tidak ditemukan", null);
        }

        return responseFormat(200, "Rencana anggaran berhasil dihapus", deletedBudgetItem);
    } catch (error) {
        console.log(error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal menghapus rencana anggaran", null);
    }
}

export async function PUT(req: Request) {
    try {
        const reqBody = await req.json();
        const { budget_item_id:budgetItemId, category_id:categoryId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, budget_id:budgetId, ...planData } = reqBody;
        console.log("Data PUT", budgetItemId, categoryId, serviceId, inventoryId, purchasingId, planData);
        const existingPlanItem = await prisma.budgetPlanItem.findFirst({
            where: { budget_item_id: budgetItemId, is_deleted: false },
        });

        if (!existingPlanItem) {
            return responseFormat(404, "Rencana anggaran tidak ditemukan", null);
        }

        const updatedBudgetPlan = await prisma.$transaction(async (transactions) => {
            if (existingPlanItem.vendor_service_id !== null && (inventoryId || purchasingId)) {
                await transactions.vendorService.update({
                    where: { service_id: existingPlanItem.vendor_service_id },
                    data: {
                        budget_plan_item: {
                            disconnect: { budget_item_id: budgetItemId },
                        },
                    },
                });
                await transactions.budgetPlanItem.update({
                    where: { budget_item_id: budgetItemId },
                    data: {
                        vendor_service: { disconnect: true },
                    }
                });
            }

            if (existingPlanItem.inventory_id !== null) {
                await transactions.inventory.update({
                    where: { inventory_id: existingPlanItem.inventory_id },
                    data: {
                        budget_plan_item: {
                            disconnect: { budget_item_id: budgetItemId },
                        },
                    },
                });
                await transactions.budgetPlanItem.update({
                    where: { budget_item_id: budgetItemId },
                    data: {
                        inventory: { disconnect: true },
                    }
                });
            }

            if (existingPlanItem.other_item_id !== null) {
                await transactions.purchasing.update({
                    where: { other_item_id: existingPlanItem.other_item_id },
                    data: {
                        budget_plan_item: {
                            disconnect: { budget_item_id: budgetItemId },
                        },
                        is_deleted: true,
                    },
                });
                await transactions.budgetPlanItem.update({
                    where: { budget_item_id: budgetItemId },
                    data: {
                        other_item: { disconnect: true },
                    },
                })
            }

            if (serviceId) {
                await transactions.budgetPlanItem.update({
                    where: { budget_item_id: budgetItemId },
                    data: {
                        vendor_service: { connect: { service_id: serviceId } },
                    }
                });
                await transactions.vendorService.update({
                    where: { service_id: serviceId },
                    data: {
                        budget_plan_item: {
                            connect: { budget_item_id: budgetItemId },
                        }
                    },
                });
            } 
            
            if (inventoryId) {
                await transactions.budgetPlanItem.update({
                    where: { budget_item_id: budgetItemId },
                    data: {
                        inventory: { connect: { inventory_id: inventoryId } },
                    }
                });
                await transactions.inventory.update({
                    where: { inventory_id: inventoryId },
                    data: {
                        budget_plan_item: {
                            connect: { budget_item_id: budgetItemId },
                        }
                    },
                });
            }

            if (purchasingId) {
                await transactions.budgetPlanItem.update({
                    where: { budget_item_id: budgetItemId },
                    data: {
                        other_item: { connect: { other_item_id: purchasingId } },
                    }
                });
                await transactions.purchasing.update({
                    where: { other_item_id: purchasingId },
                    data: {
                        budget_plan_item: {
                            connect: { budget_item_id: budgetItemId },
                        },
                        is_deleted: false,
                    },
                });
            }
            
            const updatedBudgetPlan = await transactions.budgetPlanItem.update({
                where: { budget_item_id: budgetItemId },
                data: {
                    ...planData,
                    category: {connect: {category_id: categoryId}},
                    budget: {connect: {budget_id: budgetId}},
                },
                include: {
                    category: true,
                    vendor_service: true,
                    inventory: true,
                    other_item: true,
                },
            });
            
            return updatedBudgetPlan;
        });

        if (!updatedBudgetPlan) {
            return responseFormat(404, "Rencana anggaran tidak ditemukan", null);
        }

        return responseFormat(200, "Rencana anggaran berhasil diubah", updatedBudgetPlan);
    } catch (error) {
        console.log(error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal mengubah rencana anggaran", null);
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const event_id = searchParams.get("event_id");
        const budget_id = searchParams.get("budget_id");

        if (budget_id) {
            const budgetPlanItems = await prisma.budgetPlanItem.findMany({
                where: {
                    budget_id: budget_id,
                },
                include: {
                    category: true,
                    vendor_service: true,
                    inventory: true,
                    other_item: true,
                },
            });
            return responseFormat(200, "Rencana anggaran ditemukan", budgetPlanItems);
        }

        if (event_id) {
            const budgetPlanItems = await prisma.$transaction(async (transactions) => {
                const budget = await transactions.budget.findFirst({
                    where: {
                        event_id: event_id,
                        is_deleted: false,
                        is_actual: false,
                    },
                });
    
                const budgetPlanItems = await prisma.budgetPlanItem.findMany({
                    where: {
                        budget_id: budget?.budget_id,
                    },
                    include: {
                        category: true,
                        vendor_service: true,
                        inventory: true,
                        other_item: true,
                    },
                });
                return budgetPlanItems;
            });
            return responseFormat(200, "Rencana anggaran ditemukan", budgetPlanItems);
        }
    } catch {
        return responseFormat(500, "Gagal mendapatkan rencana anggaran", null);
    }
}