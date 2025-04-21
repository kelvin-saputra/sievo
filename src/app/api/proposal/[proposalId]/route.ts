import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function DELETE(req: NextRequest, context: { params: { proposalId: string } }) {
  try {
    const { proposalId } = await context.params;

    const proposal = await prisma.proposal.update({
      where: { proposal_id: proposalId },
      data: {
        is_deleted: true,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "Proposal deleted successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("❌ Error deleting proposal:", error);
    return NextResponse.json(
      { message: "Failed to delete proposal", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
