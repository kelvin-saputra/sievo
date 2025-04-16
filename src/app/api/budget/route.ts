import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";


export async function GET(req: Request) {
    try {
        const { searchParams }= new URL(req.url);
        const event_id  = searchParams.get('event_id');
        const is_actual = (searchParams.get('is_actual') === "true");

        if (!event_id) {
            return responseFormat(400, "Event ID tidak ditemukan", null);
        }

        const budgets = await prisma.budget.findFirst({
            where: { event_id: event_id, is_actual: is_actual },
        });

        return responseFormat(200, "Budget ditemukan", budgets);
    } catch {
        return responseFormat(500, "Gagal mendapatkan budget", null);
    }
}

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();
        const { event_id, ...budgetData } = reqBody;

        const budgetList = await prisma.$transaction(async (transactions) => {
            const budgetPlan = await transactions.budget.create({
                data: {
                    ...budgetData,
                    event: { connect: { event_id: event_id } },
                    is_actual: false,
                },
            });

            const actualBudget = await transactions.budget.create({
                data: {
                    ...budgetData,
                    event: { connect: { event_id: event_id } },
                    is_actual: true,
                },
            });

            await transactions.event.update({
                where: { event_id: event_id },
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
            return responseFormat(400, "Budget gagal dibuat", null);
        }

        return responseFormat(201, "Budget berhasil dibuat", budgetList);
    } catch (error) {
        console.log("error POST budget", error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal membuat budget", null);
    }
}