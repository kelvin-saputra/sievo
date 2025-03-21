import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();
        const { category_id:categoryId, budget_id:budgetId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, ...actualData } = reqBody;
        let vendorService, inventory, purchasing;
        // Object item
        if (serviceId) {
            vendorService = await prisma.vendorService.findUnique({
                where: { service_id: serviceId, is_deleted: false },
            });
        }
        if (inventoryId) {
            inventory = await prisma.inventory.findUnique({
                where: { inventory_id: inventoryId, is_deleted: false },
            });
        }
        if (purchasingId) {
            purchasing = await prisma.purchasing.findUnique({
                where: { other_item_id: purchasingId, is_deleted: false },
            });
        }
        
        if (!vendorService && !inventory && !purchasing) {
            return responseFormat(404, "Data tidak ditemukan", null);
        }
        const actualBudgetItem = await prisma.$transaction(async (transactions) => {    
            let actualBudget;      
            if (serviceId) {
                actualBudget = await transactions.actualBudgetItem.create({
                    data: {
                        ...actualData,
                        category: {connect: {category_id: categoryId}},
                        budget: {connect: {budget_id: budgetId}},
                        vendor_service: { connect: { service_id: serviceId } },
                    },
                    include: {
                        category: true,
                        vendor_service: true,
                        inventory: true,
                        other_item: true,
                    },
                });
                await transactions.vendorService.update({
                    where: { service_id: serviceId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actualData.actual_budget_item_id },
                        }
                    },
                });
            }
            if (inventoryId) {
                actualBudget = await transactions.actualBudgetItem.create({
                    data: {
                        ...actualData,
                        category: {connect: {category_id: categoryId}},
                        budget: {connect: {budget_id: budgetId}},
                        inventory: { connect: { inventory_id: inventoryId } },
                    },
                    include: {
                        category: true,
                        vendor_service: true,
                        inventory: true,
                        other_item: true,
                    },
                });
                await transactions.inventory.update({
                    where: { inventory_id: inventoryId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actualData.actual_budget_item_id },
                        }
                    },
                });
            }
            if (purchasingId) {
                actualBudget = await transactions.actualBudgetItem.create({
                    data: {
                        ...actualData,
                        category: {connect: {category_id: categoryId}},
                        budget: {connect: {budget_id: budgetId}},
                        other_item: { connect: { other_item_id: purchasingId } },
                    },
                    include: {
                        category: true,
                        vendor_service: true,
                        inventory: true,
                        other_item: true,
                    },
                });
                await transactions.purchasing.update({
                    where: { other_item_id: purchasingId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actualData.actual_budget_item_id },
                        }
                    },
                });
            }

            await transactions.budgetItemCategory.update({
                where: { category_id: categoryId, is_deleted: false },
                data: {
                    actual_budget_item: {
                        connect: { actual_budget_item_id: actualBudget?.actual_budget_item_id },
                    },
                },
            });

            await transactions.budget.update({
                where: { budget_id: actualBudget?.budget_id ?? undefined, is_deleted: false },
                data: {
                    actual_item: {
                        connect: { actual_budget_item_id: actualBudget?.actual_budget_item_id },
                    },
                },
            });

            if (!actualBudget) {
                return null;
            }
            return actualBudget;
        });
        if (!actualBudgetItem) {
            return responseFormat(400, "Gagal dalam menambahkan anggaran", null);
        }
        return responseFormat(201, "Anggaran berhasil dibuat", actualBudgetItem);
    } catch (error) {
        console.log(error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal membuat anggaran", null);
    }
}

export async function DELETE(req: Request) {
    try {
        console.log("masuk DELETE budgetitem actual")
        const reqBody = await req.json();
        const { actual_budget_item_id } = reqBody;
        console.log(actual_budget_item_id)
        const deletedBudgetItem = await prisma.$transaction(async (transactions) => {
            const actualBudget = await transactions.actualBudgetItem.update({
                where: { actual_budget_item_id: actual_budget_item_id, is_deleted: false },
                data: { is_deleted: true},
                include: {
                    category: true,
                    vendor_service: true,
                    inventory: true,
                    other_item: true,
                },
            });
            console.log("DELETE actualBudgetItem", actualBudget);
            if (actualBudget.vendor_service_id) {
                await transactions.vendorService.update({
                    where: { service_id: actualBudget.vendor_service_id },
                    data: {
                        actual_budget_item: {
                            disconnect: { actual_budget_item_id: actual_budget_item_id },
                        },
                    },
                });
            }
            if (actualBudget.inventory_id) {
                await transactions.inventory.update({
                    where: { inventory_id: actualBudget.inventory_id },
                    data: {
                        actual_budget_item: {
                            disconnect: { actual_budget_item_id: actual_budget_item_id },
                        },
                    },
                });
            }
            if (actualBudget.other_item_id) {
                await transactions.purchasing.update({
                    where: { other_item_id: actualBudget.other_item_id },
                    data: {
                        actual_budget_item: {
                            disconnect: { actual_budget_item_id: actual_budget_item_id },
                        },
                        is_deleted: true,
                    },
                });
            }

            await transactions.budget.update({
                where: { budget_id: actualBudget.budget_id! },
                data: {
                    actual_item: {
                        disconnect: { actual_budget_item_id: actual_budget_item_id },
                    },
                },
            });

            return actualBudget;
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
        const { actual_budget_item_id, category_id:categoryId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, budget_id:budgetId,  ...actualData } = reqBody;

        const existingActualBudget = await prisma.actualBudgetItem.findFirst({
            where: { actual_budget_item_id: actual_budget_item_id, is_deleted: false },
        });

        if (!existingActualBudget) {
            return responseFormat(404, "Rencana anggaran tidak ditemukan", null);
        }

        const updatedActualBudget = await prisma.$transaction(async (transactions) => {
            if (existingActualBudget.vendor_service_id !== null) {
                await transactions.vendorService.update({
                    where: { service_id: existingActualBudget.vendor_service_id },
                    data: {
                        actual_budget_item: {
                            disconnect: { actual_budget_item_id: actual_budget_item_id },
                        },
                    },
                });
                await transactions.actualBudgetItem.update({
                    where: { actual_budget_item_id: actual_budget_item_id },
                    data: {
                        vendor_service: { disconnect: true },
                    }
                });
            }

            if (existingActualBudget.inventory_id !== null) {
                await transactions.inventory.update({
                    where: { inventory_id: existingActualBudget.inventory_id! },
                    data: {
                        actual_budget_item: {
                            disconnect: { actual_budget_item_id: actual_budget_item_id },
                        },
                    },
                });
                await transactions.actualBudgetItem.update({
                    where: { actual_budget_item_id: actual_budget_item_id },
                    data: {
                        inventory: { disconnect: true },
                    }
                });
            }

            if (existingActualBudget.other_item_id !== null) {
                await transactions.purchasing.update({
                    where: { other_item_id: existingActualBudget.other_item_id! },
                    data: {
                        actual_budget_item: {
                            disconnect: { actual_budget_item_id: actual_budget_item_id },
                        },
                        is_deleted: true,
                    },
                });
                await transactions.actualBudgetItem.update({
                    where: { actual_budget_item_id: actual_budget_item_id },
                    data: {
                        other_item: { disconnect: true },
                    },
                })
            }

            if (serviceId) {
                await transactions.actualBudgetItem.update({
                    where: { actual_budget_item_id: actual_budget_item_id },
                    data: {
                        vendor_service: { connect: { service_id: serviceId } },
                    }
                });
                
                await transactions.vendorService.update({
                    where: { service_id: serviceId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actual_budget_item_id },
                        }
                    },
                });
            }

            if (inventoryId) {
                await transactions.actualBudgetItem.update({
                    where: { actual_budget_item_id: actual_budget_item_id },
                    data: {
                        inventory: { connect: { inventory_id: inventoryId } },
                    }
                });

                await transactions.inventory.update({
                    where: { inventory_id: inventoryId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actual_budget_item_id },
                        }
                    },
                });
            }

            if (purchasingId) {
                await transactions.actualBudgetItem.update({
                    where: { actual_budget_item_id: actual_budget_item_id },
                    data: {
                        other_item: { connect: { other_item_id: purchasingId } },
                    }
                });

                await transactions.purchasing.update({
                    where: { other_item_id: purchasingId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actual_budget_item_id },
                        }
                    },
                });
            }

            const updatedActualBudget = await transactions.actualBudgetItem.update({
                where: { actual_budget_item_id: actual_budget_item_id },
                data: {
                    ...actualData,
                    category: {connect: {category_id: categoryId}},
                    budget: {connect: {budget_id: budgetId}},
                },
            });
            return updatedActualBudget;
        });


        if (!updatedActualBudget) {
            return responseFormat(404, "Rencana anggaran tidak ditemukan", null);
        }

        return responseFormat(200, "Rencana anggaran berhasil diubah", updatedActualBudget);
    } catch (error){
        console.log(error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal mengubah rencana anggaran", null);
    }
}

export async function GET(req: Request) {
    try {
        console.log("Masuk API GET ACTUAL")
        const { searchParams } = new URL(req.url);
        const event_id = searchParams.get("event_id");
        const budget_id = searchParams.get("budget_id");


        if (budget_id) {
            console.log("pake budget id")
            const actualBudgetItems = await prisma.actualBudgetItem.findMany({
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
            return responseFormat(200, "Rencana anggaran ditemukan", actualBudgetItems);
        }

        if (event_id) {
            const actualBudgetItems = await prisma.$transaction(async (transactions) => {
                const budget = await transactions.budget.findFirst({
                    where: {
                        event_id: event_id,
                        is_deleted: false,
                        is_actual: true,
                    },
                });
                console.log("Masuk dapat budgetitng", budget)
                const actualBudgetItems = await prisma.actualBudgetItem.findMany({
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
                return actualBudgetItems;
            });
            console.log(actualBudgetItems)
            return responseFormat(200, "Rencana anggaran ditemukan", actualBudgetItems);
        }
    } catch (error) {
        console.log(error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal mendapatkan rencana anggaran", null);
    }
}