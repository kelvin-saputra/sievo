import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
// TODO:
export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { category_id:categoryId, budget_id:budgetId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, ...actualData } = reqBody;
        let vendorService, inventory, purchasing, existingVendorActualItem, existingInventoryActualItem, existingPurchasingActualItem;
        const budget = await prisma.budget.findFirst({
            where: {
                budget_id: budgetId,
                is_deleted: false
            }
        })
        if (serviceId) {
            vendorService = await prisma.vendorService.findUnique({
                where: { service_id: serviceId, is_deleted: false },
            });
            existingVendorActualItem = await prisma.actualBudgetItem.findFirst({
                where: {
                    budget_id: budgetId,
                    vendor_service_id: serviceId,
                    is_deleted: false
                }
            })
        }
        if (inventoryId) {
            inventory = await prisma.inventory.findUnique({
                where: { inventory_id: inventoryId, is_deleted: false },
            });
            existingInventoryActualItem = await prisma.actualBudgetItem.findFirst({
                where: {
                    budget_id:budgetId,
                    inventory_id: inventoryId,
                    is_deleted: false
                }
            })
        }
        if (purchasingId) {
            purchasing = await prisma.purchasing.findUnique({
                where: { other_item_id: purchasingId, is_deleted: false },
            });
            existingPurchasingActualItem = await prisma.actualBudgetItem.findFirst({
                where: {
                    budget_id: budgetId,
                    other_item_id: purchasingId,
                    is_deleted: false
                }
            })
        }
        
        if (!vendorService && !inventory && !purchasing) {
            return responseFormat(404, "Data tidak ditemukan", null);
        }

        if (existingVendorActualItem) {
            if (existingVendorActualItem.category_id !== categoryId) {
                return responseFormat(400, "Actual Budget Item has added to another category!", null)
            }
            const updatedBudgetActual = await prisma.actualBudgetItem.update({
                where: {
                    actual_budget_item_id: existingVendorActualItem.actual_budget_item_id,
                    vendor_service_id: existingVendorActualItem.vendor_service_id
                },
                data: {
                    item_subtotal: existingVendorActualItem.item_subtotal + actualData.item_subtotal,
                    item_qty: existingVendorActualItem.item_qty + actualData.item_qty
                }
            })
            return responseFormat(200, "Rencana anggaran berhasil diubah", updatedBudgetActual);
        }
        if (existingInventoryActualItem) {
            if (existingInventoryActualItem.category_id !== categoryId) {
                return responseFormat(400, "Actual Budget Item has added to another category!", null)
            }
            const updatedBudgetActual = await prisma.actualBudgetItem.update({
                where: {
                    actual_budget_item_id: existingInventoryActualItem.actual_budget_item_id,
                    inventory_id: existingInventoryActualItem.inventory_id
                },
                data: {
                    item_subtotal: existingInventoryActualItem.item_subtotal + actualData.item_subtotal,
                    item_qty: existingInventoryActualItem.item_qty + actualData.item_qty
                }
            })
            await prisma.inventory.update({
                where: {
                    inventory_id: inventoryId,
                },
                data: {
                    item_qty_reserved: inventory?.item_qty_reserved + actualData.item_qty
                }
            })
            return responseFormat(200, "Budget Actual Item Successfully Added!", updatedBudgetActual);
        }
        if (existingPurchasingActualItem) {
            if (existingPurchasingActualItem.category_id !== categoryId) {
                return responseFormat(400, "Actual Budget Item has added to another category!", null)
            }
            const updatedBudgetActual = await prisma.actualBudgetItem.update({
                where: {
                    actual_budget_item_id: existingPurchasingActualItem.actual_budget_item_id,
                    other_item_id: existingPurchasingActualItem.other_item_id
                },
                data: {
                    item_subtotal: existingPurchasingActualItem.item_subtotal + actualData.item_subtotal,
                    item_qty: existingPurchasingActualItem.item_qty + actualData.item_qty
                }
            })
            return responseFormat(200, "Budget Actual Item Successfully Added!", updatedBudgetActual);
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
                const inventory = await transactions.inventory.findFirst({
                    where: {
                        inventory_id: inventoryId,
                    }
                })
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
                const budgetPlan = await transactions.budget.findFirst({
                    where: {
                        event_id: budget?.event_id || "",
                        is_actual: false,
                    }
                })

                const relatedBudgetPlanItem = await transactions.budgetPlanItem.findFirst({
                    where: {
                        budget_id: budgetPlan?.budget_id,
                        inventory_id: inventoryId
                    }
                })

                await transactions.inventory.update({
                    where: { inventory_id: inventoryId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actualData.actual_budget_item_id },
                        },
                        item_qty_reserved: (inventory?.item_qty_reserved||0) + actualData.item_qty - (relatedBudgetPlanItem?.item_qty||0)
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

            return actualBudget;
        });
        if (!actualBudgetItem) {
            return responseFormat(400, "Failed to add actual budget item!", null);
        }
        return responseFormat(201, "Actual Budget Item Successfully Added!", actualBudgetItem);
    } catch {
        return responseFormat(500, "Failed when creating budget actual item!", null);
    }
}

export async function DELETE(req: NextRequest ) {
    try {
        const reqBody = await req.json();
        const { actual_budget_item_id } = reqBody;
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
                const inventory = await transactions.inventory.findFirst({
                    where: {
                        inventory_id: actualBudget.inventory_id,
                    }
                })
                await transactions.inventory.update({
                    where: { inventory_id: actualBudget.inventory_id },
                    data: {
                        actual_budget_item: {
                            disconnect: { actual_budget_item_id: actual_budget_item_id },
                        },
                        item_qty_reserved: (inventory?.item_qty_reserved || 0) - actualBudget.item_qty
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
            return responseFormat(404, "Actual Budget Item Not Found!", null);
        }
        
        return responseFormat(200, "Actual budget item successfully deleted!", deletedBudgetItem);
    } catch {
        return responseFormat(500, "Failed when deleting actual budget item!", null);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { actual_budget_item_id, category_id:categoryId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, budget_id:budgetId,  ...actualData } = reqBody;

        const existingActualBudget = await prisma.actualBudgetItem.findFirst({
            where: { actual_budget_item_id: actual_budget_item_id, is_deleted: false },
            include: {other_item: true},
        });

        if (!existingActualBudget) {
            return responseFormat(404, "Actual Budget Item NoT Found", null);
        }

        const existingVendorActualItem = await prisma.actualBudgetItem.findFirst({
            where: {
                budget_id: budgetId,
                vendor_service_id: serviceId,
                is_deleted: false
            }
        })
        
        const existingInventoryActualItem = await prisma.actualBudgetItem.findFirst({
            where: {
                budget_id: budgetId,
                inventory_id: inventoryId,
                is_deleted: false
            }
        })
        
        const existingPurchasingActualItem = await prisma.actualBudgetItem.findFirst({
            where: {
                budget_id:budgetId,
                other_item_id: purchasingId,
                is_deleted: false
            },
            include: {
                other_item: true
            }
        })

        if (existingActualBudget.vendor_service_id === existingVendorActualItem?.vendor_service_id) {
            const updatedActualBudget = await prisma.$transaction(async (transactions) => {
                const updatedActualBudget = await transactions.actualBudgetItem.update({
                    where: {
                        actual_budget_item_id: existingActualBudget.actual_budget_item_id,
                        vendor_service_id: existingVendorActualItem.vendor_service_id,
                    },
                    data: {
                        ...actualData,
                        item_qty: (existingActualBudget.actual_budget_item_id === existingVendorActualItem.actual_budget_item_id)? actualData.item_qty: existingVendorActualItem.item_qty + actualData.item_qty
                    }
                })
                if (existingActualBudget.actual_budget_item_id !== existingVendorActualItem.actual_budget_item_id){
                    const deletedItem = await transactions.actualBudgetItem.delete({
                        where: {
                            actual_budget_item_id: existingActualBudget.actual_budget_item_id,
                        }
                    })
                    if (deletedItem.inventory_id) {
                        const inventory = await transactions.inventory.findFirst({
                            where: {
                                inventory_id: deletedItem.inventory_id
                            }
                        })
                        await transactions.inventory.update({
                            where: {
                                inventory_id: deletedItem.inventory_id,
                            },
                            data: {
                                item_qty_reserved: (inventory?.item_qty_reserved||0) - deletedItem.item_qty
                            }
                        })
                    }
                }
                return updatedActualBudget;
            }) 
            
            return responseFormat(200, "Budget plan item successfully updated!", updatedActualBudget);
        }
        if (existingActualBudget.inventory_id === existingInventoryActualItem?.inventory_id) {
            const updatedActualBudget = await prisma.$transaction(async (transactions) => {
                const updatedActualBudget = await transactions.actualBudgetItem.update({
                    where: {
                        actual_budget_item_id: existingActualBudget.actual_budget_item_id,
                        inventory_id: existingInventoryActualItem.inventory_id,
                    },
                    data: {
                        ...actualData,
                        item_qty: (existingActualBudget.actual_budget_item_id === existingInventoryActualItem.actual_budget_item_id)? actualData.item_qty: existingInventoryActualItem.item_qty + actualData.item_qty
                    }
                })
                if (existingActualBudget.actual_budget_item_id !== existingInventoryActualItem.actual_budget_item_id){
                    const deletedItem = await transactions.actualBudgetItem.delete({
                        where: {
                            actual_budget_item_id: existingActualBudget.actual_budget_item_id,
                        }
                    })
                    if (deletedItem.inventory_id) {
                        const inventory = await transactions.inventory.findFirst({
                            where: {
                                inventory_id: deletedItem.inventory_id
                            }
                        })
                        await transactions.inventory.update({
                            where: {
                                inventory_id: deletedItem.inventory_id,
                            },
                            data: {
                                item_qty_reserved: (inventory?.item_qty_reserved||0) - deletedItem.item_qty
                            }
                        })
                    }
                }
                const inventory = await transactions.inventory.findFirst({
                    where: {
                        inventory_id: existingActualBudget.inventory_id || "",
                    }
                })

                await transactions.inventory.update({
                    where: {
                        inventory_id: existingActualBudget.inventory_id || "",
                    },
                    data: {
                        item_qty_reserved: (inventory?.item_qty_reserved||0) - existingInventoryActualItem.item_qty + updatedActualBudget.item_qty,
                    }
                })
                return updatedActualBudget;
            })
            return responseFormat(200, "Actual budget item successfully updated!", updatedActualBudget);
        }
        if (existingActualBudget.other_item === existingPurchasingActualItem?.other_item_id) {
            const updatedBudgetPlan = await prisma.$transaction(async (transactions) => {
                const updatedBudgetPlan = await transactions.actualBudgetItem.update({
                    where: {
                        actual_budget_item_id: existingActualBudget.actual_budget_item_id,
                        other_item_id: existingPurchasingActualItem.other_item_id,
                    },
                    data: {
                        ...actualData,
                        item_qty: (existingActualBudget.actual_budget_item_id === existingPurchasingActualItem.actual_budget_item_id)? actualData.item_qty: existingPurchasingActualItem.item_qty + actualData.item_qty
                    }
                })
                if (existingActualBudget.actual_budget_item_id !== existingPurchasingActualItem.actual_budget_item_id){
                    const deletedItem = await transactions.actualBudgetItem.delete({
                        where: {
                            actual_budget_item_id: existingActualBudget.actual_budget_item_id,
                        }
                    })
                    if (deletedItem.inventory_id) {
                        const inventory = await transactions.inventory.findFirst({
                            where: {
                                inventory_id: deletedItem.inventory_id
                            }
                        })
                        await transactions.inventory.update({
                            where: {
                                inventory_id: deletedItem.inventory_id,
                            },
                            data: {
                                item_qty_reserved: (inventory?.item_qty_reserved||0) - deletedItem.item_qty
                            }
                        })
                    }
                }
    
                return updatedBudgetPlan;
            })
            return responseFormat(200, "Budget plan item successfully updated!", updatedBudgetPlan);
        }

        const updatedActualBudget = await prisma.$transaction(async (transactions) => {
            if (existingActualBudget.vendor_service_id !== null && (inventoryId || purchasingId)) {
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
                const inventory = await transactions.inventory.update({
                    where: { inventory_id: existingActualBudget.inventory_id },
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

                await transactions.inventory.update({
                    where: {
                        inventory_id: inventory.inventory_id,
                    },
                    data: {
                        item_qty_reserved: inventory.item_qty_reserved - existingActualBudget.item_qty
                    }
                })
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

                const inventory = await transactions.inventory.findFirst({
                    where: {inventory_id: inventoryId}
                })

                await transactions.inventory.update({
                    where: { inventory_id: inventoryId },
                    data: {
                        actual_budget_item: {
                            connect: { actual_budget_item_id: actual_budget_item_id },
                        },
                        item_qty_reserved: (inventory?.item_qty_reserved || 0) + existingActualBudget.item_qty
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
                        },
                        is_deleted: false,
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
                include: {
                    category: true,
                    vendor_service: true,
                    inventory: true,
                    other_item: true,
                },
            });
            return updatedActualBudget;
        });


        if (!updatedActualBudget) {
            return responseFormat(404, "Actual budget item not found!", null);
        }

        return responseFormat(200, "Actual budget item successfully updated!", updatedActualBudget);
    } catch {
        return responseFormat(500, "Failed when updating actual budget item!", null);
    }
}