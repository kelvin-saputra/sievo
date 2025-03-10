import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
    try {
        const proposals = prisma.proposal.findMany();
        return NextResponse.json(proposals);
    } catch (error: unknown) {
        return NextResponse.json(
          {
            error: "Gagal mengambil data proposal",
            details: error instanceof Error ? error.message : null,
          },
          { status: 500 }
        );
      }
      
    
}