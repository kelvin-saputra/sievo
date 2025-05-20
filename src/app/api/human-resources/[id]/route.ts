import { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

interface RequestBody {
  updated_by?: string;
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return responseFormat(400, "User Events ID Required", null);
    }
    let reqBody: RequestBody = {};
    try {
      reqBody = await req.json();
    } catch {
      reqBody = {};
    }
    const { updated_by } = reqBody;

    const updatedUserEvents = await prisma.userEvent.update({
      where: { id },
      data: {
        is_deleted: true,
        updated_by,
      },
    });

    return responseFormat(200, "Delete Assignment is Successful", updatedUserEvents);
  } catch (error) {
    console.error("Error:", error);
    return responseFormat(500, "Failed to Delete Assignment", null);
  }
}
