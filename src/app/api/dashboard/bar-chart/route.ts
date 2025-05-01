import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        is_deleted: false,
      },
      select: {
        event_name: true,
        event_id: true,
        task: {
          where: {
            is_deleted: false,
          },
          select: {
            status: true,
          },
        },
      },
    });

    const result = events.map((event) => {
      const totalTasks = event.task.length;
      const completedTasks = event.task.filter((t) => t.status === "DONE").length;

      return {
        event_name: event.event_name,
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Gagal mengambil data task completion.",
      },
      { status: 500 }
    );
  }
}
