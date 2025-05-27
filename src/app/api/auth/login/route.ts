import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

import { encryptAES } from "@/lib/aes";
import { setSession } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    if (!email || !password) {
        return responseFormat(400, "Email and password are required", null);
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
                password: await encryptAES(password),
                is_active: true,
                ended_at: undefined,
            }
        });
        if (!user) {
            return responseFormat(404, "User not found, please register first", null);
        }
        const cookiesToSet = await setSession(user.id, user.name, user.role);
        user.password = "[PASSWORD IS HIDDEN]";
        return responseFormat(200, "Login Successful", user, cookiesToSet, "/");
    } catch {
        return responseFormat(500, "Error occurred during login, please try again", null);
    }
}