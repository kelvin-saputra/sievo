import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
      userEvents: {
        where: {
        is_deleted: false,
        event: {
          is_deleted: false,
          status: {
            not: "DONE"
          }
        }
        },
      }
      },
    });

    type UserWithUserEvents = {
      id: string;
      is_active: boolean;
      userEvents: { is_deleted: boolean }[];
    };

    const updatedUsers = users.map((user: UserWithUserEvents) => {
      const activeUserEventsCount = user.userEvents.filter(event => !event.is_deleted).length;

      return {
        ...user,
        userEventsCount: activeUserEventsCount,
      };
    });

    console.log("Updated Users with active userEvents count:", updatedUsers);

    return NextResponse.json(updatedUsers);
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      error: "Failed to fetch users",
    });
  }
}


export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { user_id, event_ids, updated_by } = data;

    if (!user_id || !Array.isArray(event_ids) || event_ids.length === 0) {
      return NextResponse.json(
        { error: "Please provide user_id and a non-empty array of event_ids." },
        { status: 400 }
      );
    }

    // Fetch all existing assignments for this user and given event_ids
    const existingAssignments = await prisma.userEvent.findMany({
      where: {
        userId: user_id,
        eventId: { in: event_ids },
      },
    });

    const activeAssignments = existingAssignments.filter(a => !a.is_deleted);
    const deletedAssignments = existingAssignments.filter(a => a.is_deleted);

    if (activeAssignments.length > 0) {
      return NextResponse.json(
        {
          error: "User already assigned to one or more of the selected events.",
          details: "User is already assigned to this event.",
        },
        { status: 409 }
      );
    }

    const userAssignments = await prisma.userEvent.findMany({
      where: {
        userId: user_id,
        is_deleted: false,  // only active assignments
      },
    });

    if (userAssignments.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User is already assigned to other events. Do you want to proceed with the new event?",
        },
        { status: 200 }
      );
    }

    

    const reactivatePromises = deletedAssignments.map(a =>
      prisma.userEvent.update({
        where: { id: a.id },
        data: {
          is_deleted: false,
          updated_by,
        },
      })
    );

    // For events not in existingAssignments, create new assignments
    const newEventIds = event_ids.filter(
      (eventId) => !existingAssignments.some(a => a.eventId === eventId)
    );

    const createPromises = newEventIds.map(eventId =>
      prisma.userEvent.create({
        data: {
          userId: user_id,
          eventId,
          updated_by,
          is_deleted: false,
        },
      })
    );

    // Run all updates and creates in a transaction
    const result = await prisma.$transaction([
      ...reactivatePromises,
      ...createPromises,
    ]);

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
