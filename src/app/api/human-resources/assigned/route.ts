import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        userEvents: true,
      },
    });

    type UserWithUserEvents = {
      id: string;
      is_active: boolean;
      userEvents: any[];
    };

    const updatedUsers = users.map((user: UserWithUserEvents) => {
      let status: string;

      if (!user.is_active) {
        status = "inactive";
      } else if (user.userEvents.length === 0) {
        status = "unassigned";
      } else {
        status = "assigned";
      }

      return {
        ...user,
        status,
      };
    });

    console.log("Updated Users:", updatedUsers);

    return NextResponse.json(updatedUsers);
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      error: "Failed to fetch users",
    });
  }
}