import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();
        const { category_id:categoryId, budget_id:budgetId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, ...planData } = reqBody;
        let vendorService, inventory, purchasing, existingVendorPlanItem, existingInventoryPlanItem, existingPurchasingPlanItem;

        if (serviceId) {
            vendorService = await prisma.vendorService.findFirst({
                where: { service_id: serviceId, is_deleted: false },
            });
            existingVendorPlanItem = await prisma.budgetPlanItem.findFirst({
                where: {
                    budget_id: budgetId,
                    vendor_service_id: serviceId,
                    is_deleted: false
                }
            })
        }
        if (inventoryId) {
            inventory = await prisma.inventory.findFirst({
                where: { inventory_id: inventoryId, is_deleted: false },
            });
            existingInventoryPlanItem = await prisma.budgetPlanItem.findFirst({
                where: {
                    budget_id:budgetId,
                    inventory_id: inventoryId,
                    is_deleted: false
                }
            })
        }
        if (purchasingId) {
            purchasing = await prisma.purchasing.findFirst({
                where: { other_item_id: purchasingId, is_deleted: false },
            });
            existingPurchasingPlanItem = await prisma.budgetPlanItem.findFirst({
                where: {
                    budget_id: budgetId,
                    other_item_id: purchasingId,
                    is_deleted: false
                }
            })
        }
        
        if (!vendorService && !inventory && !purchasing) {
            return responseFormat(404, "Data item tidak ditemukan", null);
        }

        if (existingVendorPlanItem) {
            if (existingVendorPlanItem.category_id !== categoryId) {
                return responseFormat(400, "Budget Item Plan has added to another category!", null)
            }
            const updatedBudgetPlan = await prisma.budgetPlanItem.update({
                where: {
                    budget_item_id: existingVendorPlanItem.budget_item_id,
                    vendor_service_id: existingVendorPlanItem.vendor_service_id
                },
                data: {
                    item_subtotal: existingVendorPlanItem.item_subtotal + planData.item_subtotal,
                    item_qty: existingVendorPlanItem.item_qty + planData.item_qty
                }
            })
            return responseFormat(200, "Rencana anggaran berhasil diubah", updatedBudgetPlan);
        }
        if (existingInventoryPlanItem) {
            if (existingInventoryPlanItem.category_id !== categoryId) {
                return responseFormat(400, "Budget Item Plan has added to another category!", null)
            }
            const updatedBudgetPlan = await prisma.budgetPlanItem.update({
                where: {
                    budget_item_id: existingInventoryPlanItem.budget_item_id,
                    inventory_id: existingInventoryPlanItem.inventory_id
                },
                data: {
                    item_subtotal: existingInventoryPlanItem.item_subtotal + planData.item_subtotal,
                    item_qty: existingInventoryPlanItem.item_qty + planData.item_qty
                }
            })
            await prisma.inventory.update({
                where: {
                    inventory_id: inventoryId,
                },
                data: {
                    item_qty_reserved: inventory?.item_qty_reserved + planData.item_qty
                }
            })
            return responseFormat(200, "Budget Plan Item Successfully Added!", updatedBudgetPlan);
        }

        if (existingPurchasingPlanItem) {
            if (existingPurchasingPlanItem.category_id !== categoryId) {
                return responseFormat(400, "Budget Item Plan has added to another category!", null)
            }
            const updatedBudgetPlan = await prisma.budgetPlanItem.update({
                where: {
                    budget_item_id: existingPurchasingPlanItem.budget_item_id,
                    other_item_id: existingPurchasingPlanItem.other_item_id
                },
                data: {
                    item_subtotal: existingPurchasingPlanItem.item_subtotal + planData.item_subtotal,
                    item_qty: existingPurchasingPlanItem.item_qty + planData.item_qty
                }
            })
            return responseFormat(200, "Budget Plan Item Successfully Added!", updatedBudgetPlan);
        }
        
        const budgetPlanItem = await prisma.$transaction(async (transactions) => {   
            let budgetPlan;       
            if (serviceId) {
                budgetPlan = await transactions.budgetPlanItem.create({
                    data: {
                        ...planData,
                        vendor_service: {connect: {service_id:serviceId}},
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
                const inventory = await transactions.inventory.findFirst({
                    where: {
                        inventory_id: inventoryId,
                    }
                })
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
                        item_qty_reserved: (inventory?.item_qty_reserved||0) + planData.item_qty
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

            await transactions.budgetItemCategory.update({
                where: { category_id: categoryId, is_deleted: false },
                data: {
                    budget_plan_item: {
                        connect: { budget_item_id: budgetPlan?.budget_item_id },
                    },
                },
            });

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
                return responseFormat(400, "Failed to create budget plan item!", null);
            }
            return responseFormat(201, "Budget Plan Item Successfully Added!", budgetPlanItem);
    } catch {
        return responseFormat(500, "Failed when creating budget plan item!", null);
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
                const inventory = await transactions.inventory.findFirst({
                    where: {
                        inventory_id: budgetPlan.inventory_id
                    }
                })
                await transactions.inventory.update({
                    where: { inventory_id: budgetPlan.inventory_id },
                    data: {
                        budget_plan_item: {
                            disconnect: { budget_item_id: budget_item_id },
                        },
                        item_qty_reserved: (inventory?.item_qty_reserved || 0) - budgetPlan.item_qty
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
            return responseFormat(404, "Budget plan item not found!", null);
        }

        return responseFormat(200, "Budget plan item successfully deleted!", deletedBudgetItem);
    } catch {
        return responseFormat(500, "Failed when deleting budget plan item!", null);
    }
}

export async function PUT(req: Request) {
    try {
        const reqBody = await req.json();
        const { budget_item_id:budgetItemId, category_id:categoryId, vendor_service_id:serviceId, inventory_id:inventoryId, other_item_id:purchasingId, budget_id:budgetId, ...planData } = reqBody;
        
        const existingPlanItem = await prisma.budgetPlanItem.findFirst({
            where: { budget_item_id: budgetItemId, is_deleted: false },
            include: {other_item: true}
        });
        
        if (!existingPlanItem) {
            return responseFormat(404, "Budget plan item not found!", null);
        }

        const existingVendorPlanItem = await prisma.budgetPlanItem.findFirst({
            where: {
                budget_id: budgetId,
                vendor_service_id: serviceId,
                is_deleted: false
            }
        })
        
        const existingInventoryPlanItem = await prisma.budgetPlanItem.findFirst({
            where: {
                budget_id: budgetId,
                inventory_id: inventoryId,
                is_deleted: false
            }
        })
        
        const existingPurchasingPlanItem = await prisma.budgetPlanItem.findFirst({
            where: {
                budget_id:budgetId,
                other_item_id: purchasingId,
                is_deleted: false
            },
            include: {
                other_item: true
            }
        })
        
        if (existingPlanItem.vendor_service_id === existingVendorPlanItem?.vendor_service_id) {
            const updatedBudgetPlan = await prisma.$transaction(async (transactions) => {
                const updatedBudgetPlan = await transactions.budgetPlanItem.update({
                    where: {
                        budget_item_id: existingPlanItem.budget_item_id,
                        vendor_service_id: existingVendorPlanItem.vendor_service_id,
                    },
                    data: {
                        ...planData,
                        item_qty: (existingPlanItem.budget_item_id === existingVendorPlanItem.budget_item_id)? planData.item_qty: existingVendorPlanItem.item_qty + planData.item_qty
                    }
                })
                if (existingPlanItem.budget_item_id !== existingVendorPlanItem.budget_item_id){
                    const deletedItem = await transactions.budgetPlanItem.delete({
                        where: {
                            budget_item_id: existingPlanItem.budget_item_id,
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
        if (existingPlanItem.inventory_id === existingInventoryPlanItem?.inventory_id) {
            const updatedBudgetPlan = await prisma.$transaction(async (transactions) => {
                const updatedBudgetPlan = await transactions.budgetPlanItem.update({
                    where: {
                        budget_item_id: existingPlanItem.budget_item_id,
                        inventory_id: existingInventoryPlanItem.inventory_id,
                    },
                    data: {
                        ...planData,
                        item_qty: (existingPlanItem.budget_item_id === existingInventoryPlanItem.budget_item_id)? planData.item_qty: existingInventoryPlanItem.item_qty + planData.item_qty
                    }
                })
                if (existingPlanItem.budget_item_id !== existingInventoryPlanItem.budget_item_id){
                    const deletedItem = await transactions.budgetPlanItem.delete({
                        where: {
                            budget_item_id: existingPlanItem.budget_item_id,
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
                        inventory_id: existingInventoryPlanItem.inventory_id || "",
                    }
                })

                await transactions.inventory.update({
                    where: {
                        inventory_id: updatedBudgetPlan.inventory_id || "",
                    },
                    data: {
                        item_qty_reserved: (inventory?.item_qty_reserved||0) - existingInventoryPlanItem.item_qty + updatedBudgetPlan.item_qty,
                    }
                })
    
                return updatedBudgetPlan;
            })
            return responseFormat(200, "Budget plan item successfully updated!", updatedBudgetPlan);
        }
        if (existingPlanItem.other_item === existingPurchasingPlanItem?.other_item_id) {
            const updatedBudgetPlan = await prisma.$transaction(async (transactions) => {
                const updatedBudgetPlan = await transactions.budgetPlanItem.update({
                    where: {
                        budget_item_id: existingPlanItem.budget_item_id,
                        other_item_id: existingPurchasingPlanItem.other_item_id,
                    },
                    data: {
                        ...planData,
                        item_qty: (existingPlanItem.budget_item_id === existingPurchasingPlanItem.budget_item_id)? planData.item_qty: existingPurchasingPlanItem.item_qty + planData.item_qty
                    }
                })
                if (existingPlanItem.budget_item_id !== existingPurchasingPlanItem.budget_item_id){
                    const deletedItem = await transactions.budgetPlanItem.delete({
                        where: {
                            budget_item_id: existingPlanItem.budget_item_id,
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

        const updatedBudgetPlan = await prisma.$transaction(async (transactions) => {
            if (existingPlanItem.vendor_service_id !== null) {
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
                const inventory = await transactions.inventory.update({
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
                await transactions.inventory.update({
                    where: {
                        inventory_id: inventory.inventory_id,
                    },
                    data: {
                        item_qty_reserved: inventory.item_qty_reserved - existingPlanItem.item_qty
                    }
                })
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
                const existingItem = await transactions.budgetPlanItem.update({
                    where: { budget_item_id: budgetItemId },
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
                        budget_plan_item: {
                            connect: { budget_item_id: budgetItemId },
                        },
                        item_qty_reserved: inventory?.item_qty_reserved||0 + existingItem.item_qty
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
            return responseFormat(404, "Budget plan item not found!", null);
        }

        return responseFormat(200, "Budget plan item successfully updated!", updatedBudgetPlan);
    } catch {
        return responseFormat(500, "Failed when updating budget plan item!", null);
    }
}