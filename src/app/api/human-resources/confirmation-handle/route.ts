import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { user_id, event_ids,updated_by } = data;

    if (!user_id || !Array.isArray(event_ids) || event_ids.length === 0) {
      return NextResponse.json(
        { error: "Please provide user_id and a non-empty array of event_ids." },
        { status: 400 }
      );
    }

    const existingAssignments = await prisma.userEvent.findMany({
      where: {
        userId: user_id,
        eventId: { in: event_ids },
      },
    });

    if (existingAssignments.length > 0) {
      return NextResponse.json(
        {
          error: "User already assigned to one or more of the selected events.",
          details: "User is already assigned to this event.",
        },
        { status: 409 }
      );
    }

    const assignments = event_ids.map((eventId: string) => {
      return prisma.userEvent.create({
        data: {
          userId: user_id,
          eventId: eventId,
          updated_by:updated_by,
          is_deleted: false,

        },
      });
    });

    const result = await prisma.$transaction(assignments);

    return NextResponse.json(
      { message: "User successfully assigned to events", assigned: result },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to assign user to events",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
