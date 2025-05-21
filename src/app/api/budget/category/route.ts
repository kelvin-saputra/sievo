import { responseFormat } from "@/utils/api"
import { prisma } from "@/utils/prisma"
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams }= new URL(req.url);
        const event_id  = searchParams.get('event_id')!;
        const is_actual = searchParams.get('is_actual');

        const existingEvent = await prisma.event.findFirst({
            where: {
                event_id: event_id,
            }
        });

        if (!existingEvent) {
            return responseFormat(400, "Event not found!", null);
        }

        const categoriesBudget = await prisma.$transaction(async (transactions) => {
            const budget = await transactions.budget.findFirst({
                where: {
                    event_id,
                    is_deleted: false,
                    is_actual: (is_actual === 'true')
                },
            });

            const categories = await prisma.budgetItemCategory.findMany({
                where: { 
                    budget: { 
                        budget_id: budget?.budget_id,
                    },
                    is_deleted: false,
                },
            })
            return {categories, budget};
        });
        const { categories, budget } = categoriesBudget;
        if (categories.length === 0) {
            return responseFormat(404, `${budget?.is_actual? "Actual":"Plan"} budget categories not created yet!`, null)
        }
        return responseFormat(200, `Successfully retrieved ${budget?.is_actual? "actual":"plan"} budget categories`, categories)
    } catch {
        return responseFormat(500, "Failed to retrieve budget categories", null)
    }
}

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { budget_id, category_name }  = reqBody;

        const existingBudget = await prisma.budget.findFirst({
            where: {
                budget_id: budget_id,
                is_deleted: false,
            }
        })
        if (!existingBudget) {
            return responseFormat(400, "Budget not found!", null);
        }

        const existingCategory = await prisma.budgetItemCategory.findFirst({
            where: {
                budget_id: budget_id,
                category_name: category_name,
            }
        })
        
        if (existingCategory) {
            if (existingCategory.is_deleted == true) {
                const createdCategory = await prisma.$transaction(async (transactions) => {
                    const createdCategory = await transactions.budgetItemCategory.update({
                        where: {
                            category_id: existingCategory.category_id,
                            budget_id: budget_id,
                            is_deleted: true,
                        },
                        data: {
                            is_deleted: false,
                            budget_id: budget_id,
                            budget_plan_item: {},
                            actual_budget_item: {},
                        }
                    })

                    const updatedBudget = await transactions.budget.update({
                        where: { 
                            budget_id:budget_id,
                            is_deleted: false 
                        },
                        data: {
                            categories: { 
                                connect: { 
                                    category_id: createdCategory.category_id 
                                }, 
                            },
                        },
                    });
                    if (!createdCategory || !updatedBudget) {
                        return null;
                    }
                    return createdCategory
                    
                })
                if (!createdCategory) {
                    return responseFormat(400, `Failed to create category ${category_name}, invalid input!`, null)
                }
                return responseFormat(200, `Category ${category_name} successfully created!`, createdCategory)
            } else {
                return responseFormat(400, `Category ${category_name} already exists for this budget!`, null)
            }
        }

        const category = await prisma.$transaction(async (transactions) => {
            const createdCategory = await transactions.budgetItemCategory.create({
                data: {
                    category_name,
                    budget: { 
                        connect: { 
                            budget_id 
                        } 
                    },
                },
            });

            const updatedBudget = await transactions.budget.update({
                where: { 
                    budget_id:budget_id,
                    is_deleted: false 
                },
                data: {
                    categories: { 
                        connect: { 
                            category_id: createdCategory.category_id 
                        }, 
                    },
                },
            });

            if (!createdCategory || !updatedBudget) {
                return null;
            }
            return createdCategory;
        });

        if (!category) {
            return responseFormat(400, `Failed to create category ${category_name}, invalid input!`, null)
        }

        return responseFormat(200, `Category ${category_name} successfully created!`, category)
    }catch {
        return responseFormat(500, "Failed to create budget category!", null)
    }
}

export async function PUT(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { category_id, ...data } = reqBody;

        const existingCategory = await prisma.budgetItemCategory.findFirst({
            where: { 
                category_id: category_id, 
                is_deleted: false 
            }
        })

        if (!existingCategory) {
            return responseFormat(400, `Category not found!`, null)
        }

        const category = await prisma.budgetItemCategory.update({
            where: { 
                category_id: category_id, 
                is_deleted: false 
            },
            data: { 
                ...data,
            },
        })

        return responseFormat(200, "Successfully updated budget category", category)
    } catch {
        return responseFormat(500, "Failed to update budget category", null)
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const {category_id, budget_id, ...data} = reqBody;

        if (!category_id) {
            return responseFormat(400, "Category ID not found!", null)
        }

        const categoryDeleted = await prisma.$transaction(async (transactions) => {
            const actualBudgetItems = await transactions.actualBudgetItem.findMany({
                where: { category_id: category_id, is_deleted: false },
            })

            const budgetPlanItems = await transactions.budgetPlanItem.findMany({
                where: { category_id: category_id, is_deleted: false },
            })

            if (actualBudgetItems.length > 0 || budgetPlanItems.length > 0) {
                return null;
            }

            const deletedBudgetItemCategory = await transactions.budgetItemCategory.update({
                where: { category_id: category_id, budget_id: budget_id },
                data: { 
                    ...data,
                    is_deleted:true,
                }
            })
            return deletedBudgetItemCategory;
        })

        if (categoryDeleted === null) {
            return responseFormat(400, "Category cannot be deleted, budget items exist in this category!", null)
        }
        return responseFormat(200, "Successfully deleted budget category!", categoryDeleted)
    } catch {
        return responseFormat(500, "Failed to delete budget category!", null)
    }
}