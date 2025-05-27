import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";


export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const proposalId = url.pathname.split("/").pop(); // ✅ Get ID from URL

    const proposal = await prisma.proposal.update({
      where: { proposal_id: proposalId },
      data: {
        is_deleted: true,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "[SOFT-DELETED] Proposal successfully deleted!",
      data: proposal,
    });
  } catch (error) {
    console.error("❌ Error deleting proposal:", error);
    return NextResponse.json(
      {
        message: "Failed to delete proposal",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const proposalId = url.pathname.split("/").pop();
    const data = await req.json();

    const updatedProposal = await prisma.proposal.update({
      where: {
        proposal_id: proposalId!,
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedProposal);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update proposal",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

