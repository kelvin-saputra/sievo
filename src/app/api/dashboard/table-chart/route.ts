import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
    try {
        const budgets = await prisma.budget.findMany({
            where: {
                is_deleted: false,
            },
            select: {
                budget_id: true,
                status: true,
                updated_at: true,
                event_id: true,
                event: {
                    select: {
                        event_name: true,
                    },
                },
            },
            orderBy: {
                updated_at: "desc",
            },
        });

        return NextResponse.json(budgets);
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json(
            {
                error: "Failed to fetch budgets",
                details: error instanceof Error ? error.message : null,
            },
            { status: 500 }
        );
    }
}
