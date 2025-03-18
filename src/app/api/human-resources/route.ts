import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        event: true, // Include events array
      },
    });

    // Modify user data to include computed status
    const updatedUsers = users.map((user) => ({
      ...user,
      status: !user.is_active
        ? "inactive"
        : user.event.length === 0
        ? "available"
        : "on work",
    }));

    return NextResponse.json(updatedUsers);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
