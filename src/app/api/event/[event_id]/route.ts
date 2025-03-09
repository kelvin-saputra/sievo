import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

/**
 * ✅ GET satu event berdasarkan ID (Hanya jika `is_deleted = false`)
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ event_id: string }> }
) {
  const { params } = context;

  try {
    const event = await prisma.event.findFirst({
      where: { event_id: (await params).event_id, is_deleted: false },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan atau sudah dihapus" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal mengambil data event",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

/**
 * ✅ UPDATE satu event berdasarkan ID (Hanya jika `is_deleted = false`)
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ event_id: string }> }
) {
  const { params } = context;

  try {
    const data = await req.json();

    // ✅ Periksa apakah event ada dan belum dihapus
    const existingEvent = await prisma.event.findFirst({
      where: { event_id: (await params).event_id, is_deleted: false },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event tidak ditemukan atau sudah dihapus" },
        { status: 404 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { event_id: (await params).event_id },
      data,
    });

    return NextResponse.json(updatedEvent);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal memperbarui event",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

// TODO: Cascade delete EventTask
/**
 * ✅ SOFT DELETE event (Hanya jika `is_deleted = false`)
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ event_id: string }> }
) {
  const { params } = context;

  try {
    // ✅ Periksa apakah event ada dan belum dihapus
    const existingEvent = await prisma.event.findFirst({
      where: { event_id: (await params).event_id, is_deleted: false },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event tidak ditemukan atau sudah dihapus sebelumnya" },
        { status: 404 }
      );
    }

    // ✅ Soft delete dengan mengubah `is_deleted = true`
    await prisma.event.update({
      where: { event_id: (await params).event_id },
      data: { is_deleted: true },
    });

    return NextResponse.json({ message: "Event berhasil dihapus" });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal menghapus event",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
