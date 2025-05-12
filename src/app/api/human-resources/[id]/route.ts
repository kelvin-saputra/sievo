
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: { userEvents: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        let status: "inactive" | "unassigned" | "assigned";

        if (!user.is_active) {
            status = "inactive";
        } else if (user.userEvents.length === 0) {
            status = "unassigned";
        } else {
            status = "assigned";
        }

        return NextResponse.json({
            ...user,
            status,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
