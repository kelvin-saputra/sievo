import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ event_id: string }> }
) {
  const { params } = context;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        event_id: (await params).event_id,
        is_deleted: false,
      },
    });

    return NextResponse.json(tasks);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal mengambil data tugas",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ event_id: string }> }
) {
  try {
    const { params } = context;
    const eventId = (await params).event_id;
    const data = await req.json();
    const { assigned_id, ...taskData } = data;

    const event = await prisma.event.findUnique({
      where: { event_id: eventId },
      select: { is_deleted: true },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    if (event.is_deleted) {
      return NextResponse.json(
        { error: "Event sudah dihapus, tidak bisa menambahkan tugas baru" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        ...taskData,
        assigned: { connect: { id: assigned_id } },
        event: { connect: { event_id: eventId } },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal membuat tugas",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
