import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

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

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { manager_id, client_id, ...eventData } = data;
    console.log(data);
    const event = await prisma.event.create({
      data: {
        ...eventData,
        manager: { connect: { id: manager_id } },
        client: { connect: { client_id: client_id } },
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

export async function PUT(req: Request) {  
    try {
        const reqBody = await req.json();
        const eventId = reqBody.event_id;
        const existedEvent = await prisma.event.findFirst({
            where: { event_id: eventId, is_deleted: false },
        });
    
        if (!existedEvent) {
            return responseFormat(404, "Event yang akan diupdate tidak ditemukan", null);
        }
    
        const updatedEvent = await prisma.event.update({
            where: { event_id: eventId },
            data: reqBody,
        });
        
        return responseFormat(200, "Event berhasil diperbarui", updatedEvent);
    } catch  {
        return responseFormat(500, "Terjadi kesalahan saat memperbaharui event", null);
    }
}
