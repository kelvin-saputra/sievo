import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams }= new URL(req.url);
        const event_id  = searchParams.get('event_id')!;
        const is_actual = (searchParams.get('is_actual') === "true");

        const existingEvent = await prisma.event.findFirst({
            where: {
                event_id: event_id,
            }
        })
        if (!existingEvent) {
            return responseFormat(400, "Event not found!", null);
        }
        let budgets;
        if (is_actual) {
            budgets = await prisma.budget.findFirst({
                where: { 
                    event_id: event_id, 
                    is_actual: is_actual,
                    is_deleted: false,
                },
                include: {
                    categories: {
                        where: {
                            is_deleted: false
                        },
                        include: {
                            actual_budget_item: {
                                where: {
                                    is_deleted: false,
                                },
                                include: {
                                    vendor_service: true,
                                    inventory: true,
                                    other_item: true,
                                }
                            }
                        }
                    }
                }
            });
        } else {
            budgets = await prisma.budget.findFirst({
                where: { 
                    event_id: event_id, 
                    is_actual: is_actual,
                    is_deleted: false,
                },
                include: {
                    categories: {
                        where: {
                            is_deleted: false,
                        },
                        include: {
                            budget_plan_item: {
                                where: {
                                    is_deleted: false,
                                },
                                include: {
                                    vendor_service: true,
                                    inventory: true,
                                    other_item: true,
                                }
                            }
                        }
                    }
                }
            });
        }
        return responseFormat(200, `${is_actual === true? "Actual":"Planning"} Budget for event ${existingEvent.event_name} found!`, budgets);
    } catch {
        return responseFormat(500, "Failed to retrieve budget data!", null);
    }
}

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { event_id, ...budgetData } = reqBody;

        const existingEvent = await prisma.event.findFirst({
            where: {
                event_id: event_id,
            }
        })

        if (!existingEvent) {
            return responseFormat(400, "Event not found!", null);
        }

        const budgetList = await prisma.$transaction(async (transactions) => {
            const budgetPlan = await transactions.budget.create({
                data: {
                    ...budgetData,
                    event: {
                        connect: { event_id: event_id }
                    },
                    is_actual: false,
                },
            });

            const actualBudget = await transactions.budget.create({
                data: {
                    ...budgetData,
                    event: { 
                        connect: { event_id: event_id }
                    },
                    is_actual: true,
                },
            });

            await transactions.event.update({
                where: { 
                    event_id: event_id
                },
                data: {
                    budget: {
                        connect: [
                            { budget_id: budgetPlan.budget_id },
                            { budget_id: actualBudget.budget_id },
                        ],
                    },
                },
            });

            return [budgetPlan, actualBudget];
        });
        if (!budgetList) {
            return responseFormat(400, `Budget initialization for event ${existingEvent.event_name} failed!`, null);
        }

        return responseFormat(201, `Budget for event ${existingEvent.event_name} successfully initialized!`, budgetList);
    } catch {
        return responseFormat(500, "Failed to initialize budget!", null);
    }
}

export async function PUT(req: NextRequest) {
    const reqBody = await req.json();
    const {budget_id, ...data} = reqBody

    if (!budget_id) {
        return responseFormat(400, "Budget to update not available!", null);
    }
    try {
        const updatedBudget = await prisma.budget.update({
            where: {
                budget_id: budget_id,
                is_deleted: false,
                is_actual: false
            },
            data: {
                ...data
            }
        })
        return responseFormat(200, "Budget status successfully updated!", updatedBudget);
    } catch {
        return responseFormat(500, "An error occurred while updating the budget!", null);
    }
}