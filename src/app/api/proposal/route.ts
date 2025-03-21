import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";


export async function GET() {
    try {
        const proposals = await prisma.proposal.findMany();
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

export async function POST(req: Request) {
    try {
        console.log("📢 Received a request:", req.method);

        const rawBody = await req.text();
        console.log("📢 Raw Request Body:", rawBody);

        if (!rawBody) {
            throw new TypeError("Invalid request: Payload is empty or undefined");
        }

        let dataBody;
        try {
            dataBody = JSON.parse(rawBody);
        } catch (error) {
            console.error("Invalid request: Failed to parse JSON", error);
            throw new TypeError("Invalid request: Failed to parse JSON");
        }


        console.log("📢 Parsed Request Body:", dataBody);

        if (!dataBody || Object.keys(dataBody).length === 0) {
            throw new TypeError("Invalid request: Payload cannot be null or empty");
        }

        const proposalData = {
            proposal_id: dataBody.proposal_id,
            proposal_name: dataBody.proposal_name,
            client_name: dataBody.client_name,
            proposal_link: dataBody.proposal_link,
            created_by: dataBody.created_by,
            updated_by: dataBody.updated_by,
            created_at: new Date(dataBody.created_at),
            updated_at: new Date(dataBody.updated_at)
        };

        console.log("📢 Sending to Prisma (Without `status`):", proposalData);

        const proposalItem = await prisma.proposal.create({
            data: proposalData
        });

        console.log("✅ Successfully created proposal:", proposalItem);

        return Response.json({
            proposal_id: proposalItem.proposal_id,
            proposal_name: proposalItem.proposal_name,
            status: proposalItem.status,
            client_name: proposalItem.client_name,
            proposal_link: proposalItem.proposal_link,
            created_by: proposalItem.created_by,
            updated_by: proposalItem.updated_by,
            created_at: proposalItem.created_at,
            updated_at: proposalItem.updated_at,
            is_deleted: proposalItem.is_deleted
        });

    } catch (error) {
        console.error("❌ Error creating proposal:", error);
        return Response.json({
            message: "Failed to add proposal",
        }, { status: 500 });
    }
}

