import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ event_id: string }> }
) {
  const { params } = context;

  try {
    const data = await req.json();
    const { status, updated_by } = data;

    const updatedEvent = await prisma.event.update({
      where: {
        event_id: (await params).event_id,
        is_deleted: false,
      },
      data: {
        status,
        updated_by,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: `Status event berhasil diperbarui menjadi ${status}`,
      event: updatedEvent,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal memperbarui status event",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
