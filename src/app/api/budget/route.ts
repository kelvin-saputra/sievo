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
            return responseFormat(400, "Event yang dilihat tidak terdaftar!", null);
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
        return responseFormat(200, `Budget ${is_actual === true? "Actual":"Planning"} untuk event ${existingEvent.event_name} ditemukan!`, budgets);
    } catch {
        return responseFormat(500, "Gagal saat mengambil data budget!", null);
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
            return responseFormat(400, "Event yang dilihat tidak terdaftar!", null);
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
            return responseFormat(400, `Budget untuk event ${existingEvent.event_name} gagal diinisiasi!`, null);
        }

        return responseFormat(201, `Budget untuk event ${existingEvent.event_name} berhasil diinisiasi!`, budgetList);
    } catch {
        return responseFormat(500, "Gagal melakukan inisiasi budget!", null);
    }
}

export async function PUT(req: NextRequest) {
    const reqBody = await req.json();
    const {budget_id, ...data} = reqBody

    if (!budget_id) {
        return responseFormat(400, "Budget yang diupdate tidak tersedia!", null);
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
        return responseFormat(200, "Status budget berhasil diperbaharui!",updatedBudget);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat memperbaharui budget!", null);
    }
}