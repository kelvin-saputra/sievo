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
        start_date: true,
        end_date: true,
        task: {
          where: {
            is_deleted: false,
            status: {
              in: ['PENDING', 'ON_PROGRESS'],
            },
          },
          select: {
            task_id: true,
            title: true,
            due_date: true,
            status: true,
            assigned: {
              select: {
                id: true,
                name: true, 
              },
            },
          },
        },
      },
      orderBy: {
        start_date: "asc",
      },
    });



    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Gagal mengambil data event.",
      },
      { status: 500 }
    );
  }
}
