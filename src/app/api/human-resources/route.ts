import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        event: true,
      },
    });

    type UserWithEvents = {
      id: string;
      is_active: boolean;
      event: any[];
    };

    const updatedUsers = users.map((user: UserWithEvents) => ({
      ...user,
      status: !user.is_active
        ? "inactive"
        : user.event.length === 0
        ? "available"
        : "on work",
    }));

    return NextResponse.json(updatedUsers);
  } catch (error: unknown) {
    console.error("Error fetching users:", error);  // Log the actual error
    return NextResponse.json({
      error: "Failed to fetch users",
    });
  }
}
