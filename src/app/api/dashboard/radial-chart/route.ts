import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        is_deleted: false,
      },
      select: {
        event_id: true,
        event_name: true,
        budget: {
          where: {
            is_deleted: false,
          },
          select: {
            plan_item: {
              where: { is_deleted: false },
              select: {
                item_subtotal: true,
              },
            },
            actual_item: {
              where: { is_deleted: false },
              select: {
                item_subtotal: true,
              },
            },
          },
        },
      },
    });

    let totalPlanned = 0;
    let totalActual = 0;

    const eventBudgets = events.map((event) => {
      const planned = event.budget.flatMap((b) => b.plan_item).reduce((acc, item) => acc + (item.item_subtotal || 0), 0);
      const actual = event.budget.flatMap((b) => b.actual_item).reduce((acc, item) => acc + (item.item_subtotal || 0), 0);

      totalPlanned += planned;
      totalActual += actual;

      return {
        event_id: event.event_id,
        event_name: event.event_name,
        planned_budget: planned,
        actual_budget: actual,
      };
    });

    return NextResponse.json({
      planned_budget: totalPlanned,
      actual_budget: totalActual,
      events: eventBudgets,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data budget summary." },
      { status: 500 }
    );
  }
}
