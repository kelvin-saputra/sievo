import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      where: { is_deleted: false }, // ✅ Match your schema
    });

    return NextResponse.json(proposals);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch proposals",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log("📦 Received data:", data);

    const createdProposal = await prisma.proposal.create({
      data: {
        proposal_name: data.proposal_name,
        client_name: data.client_name,
        proposal_link: data.proposal_link,
        status: data.status ?? "DRAFT",
        created_by: data.created_by ?? "ID Anonymous",
        updated_by: data.updated_by ?? "ID Anonymous",
        created_at: data.created_at ? new Date(data.created_at) : new Date(),
        updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
        is_deleted: false,
      },
    });

    console.log("✅ Created Proposal:", createdProposal);
    return NextResponse.json(createdProposal);
  } catch (error) {
    console.error("❌ Prisma error (full):", JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        message: "Failed to add proposal",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
