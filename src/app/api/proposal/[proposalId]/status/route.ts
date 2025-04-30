import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";


export async function PUT(req: NextRequest, context: { params: Promise<{ proposalId: string }> }) {
  try {
    const { proposalId } = await context.params; 
    const body = await req.json();
    const { status, deleted } = body;

    if (!proposalId) {
      return NextResponse.json({ message: "Proposal ID is required" }, { status: 400 });
    }

    const existingProposal = await prisma.proposal.findUnique({
      where: { proposal_id: proposalId },
    });

    if (!existingProposal) {
      return NextResponse.json({ message: "Proposal not found" }, { status: 404 });
    }

    const updatedProposal = await prisma.proposal.update({
      where: { proposal_id: proposalId },
      data: { 
        ...(status && { status }),
        ...(typeof deleted === "boolean" && { deleted }),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedProposal);
  } catch (error: unknown) {
    return NextResponse.json({ 
      message: "Failed to update proposal", 
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
