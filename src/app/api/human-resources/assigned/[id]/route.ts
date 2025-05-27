import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: { userEvents: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const status: 'inactive' | 'unassigned' | 'assigned' =
            !user.is_active
                ? 'inactive'
                : user.userEvents.length === 0
                    ? 'unassigned'
                    : 'assigned';

        return NextResponse.json({ ...user, status });
    } catch (err) {
        console.error('Error fetching user:', err);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}
