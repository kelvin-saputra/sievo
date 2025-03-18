import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  req: Request,
  context: {
    params: Promise<{ event_id: string; task_id: string }>;
  }
) {
  const { params } = context;
  try {
    const task = await prisma.task.findFirst({
      where: {
        task_id: (await params).task_id,
        event_id: (await params).event_id,
        is_deleted: false,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Tugas tidak ditemukan atau sudah dihapus" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
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

export async function PUT(
  req: Request,
  context: { params: Promise<{ event_id: string; task_id: string }> }
) {
  const { params } = context;
  try {
    const data = await req.json();

    const existingTask = await prisma.task.findFirst({
      where: {
        task_id: (await params).task_id,
        event_id: (await params).event_id,
        is_deleted: false,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Tugas tidak ditemukan atau sudah dihapus" },
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { task_id: (await params).task_id },
      data: { ...data, updated_at: new Date() },
    });

    return NextResponse.json(updatedTask);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal memperbarui tugas",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ event_id: string; task_id: string }>;
  }
) {
  const { params } = context;

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        task_id: (await params).task_id,
        event_id: (await params).event_id,
        is_deleted: false,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Tugas tidak ditemukan atau sudah dihapus sebelumnya" },
        { status: 404 }
      );
    }

    await prisma.task.update({
      where: { task_id: (await params).task_id },
      data: { is_deleted: true, updated_at: new Date() },
    });

    return NextResponse.json({ message: "Tugas berhasil dihapus" });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal menghapus tugas",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
