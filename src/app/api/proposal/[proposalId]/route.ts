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



export async function PUT(req: NextRequest, { params }: { params: { proposalId: string } }) {
  try {
    const { proposalId } = params;
    const data = await req.json();

    console.log("📦 Received update data:", data);

    const updatedProposal = await prisma.proposal.update({
      where: {
        proposal_id: proposalId,
      },
      data: {
        proposal_name: data.proposal_name,
        client_name: data.client_name,
        proposal_link: data.proposal_link,
        updated_by: data.updated_by ?? "ID Anonymous",
        updated_at: new Date(),
      },
    });

    console.log("✅ Updated Proposal:", updatedProposal);

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error("❌ Prisma update error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        message: "Failed to update proposal",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
