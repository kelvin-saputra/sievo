import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";


export async function PUT(req: NextRequest, context: { params: Promise<{ proposalId: string }> }) {
  try {
    // ✅ Wait for params to resolve
    const { proposalId } = await context.params; // Resolving the promise of params

    // ✅ Parse request body
    const body = await req.json();
    const { status } = body;

    if (!proposalId) {
      console.error("🛑 Error: Missing proposalId in request.");
      return NextResponse.json({ message: "Proposal ID is required" }, { status: 400 });
    }

    if (!status) {
      console.error("🛑 Error: Missing status in request body.");
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    console.log("📢 Updating status for Proposal ID:", proposalId, "New Status:", status);

    // ✅ Check if the proposal exists
    const existingProposal = await prisma.proposal.findUnique({
      where: { proposal_id: proposalId },
    });

    if (!existingProposal) {
      console.error("🛑 Proposal not found in database.");
      return NextResponse.json({ message: "Proposal not found" }, { status: 404 });
    }

    // ✅ Update `status` and `updated_at`
    const updatedProposal = await prisma.proposal.update({
      where: { proposal_id: proposalId },
      data: { 
        status,
        updated_at: new Date(),
      },
    });

    console.log("✅ Proposal updated successfully:", updatedProposal);
    return NextResponse.json(updatedProposal);
  } catch (error: unknown) {
    console.error("❌ Prisma Update Error:", error);
    return NextResponse.json({ 
      message: "Failed to update status", 
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 });
  }
}
