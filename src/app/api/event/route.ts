import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

/**
 * ✅ GET semua event (Hanya jika `is_deleted = false`)
 */
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { is_deleted: false },
    });

    return NextResponse.json(events);
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
 * ✅ POST event baru (Menggunakan data yang sudah divalidasi di frontend)
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { manager_id, client_id, ...eventData } = data; // Destructure IDs separately

    const event = await prisma.event.create({
      data: {
        ...eventData, // Spread the rest of the event data
        manager: { connect: { id: manager_id } }, // Connect manager
        client: { connect: { client_id: client_id } }, // Connect client
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Gagal membuat event",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
