import { decryptAES, encryptAES } from "@/lib/aes";
import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { verify } from "@/lib/jwt";
import redisClient from "@/utils/redis";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const reqBody = await req.json();
    const { searchParams } = new URL(req.url);
    const encryptedToken = searchParams.get("token");
    if (!encryptedToken) {
        return responseFormat(400, "Registration token is not valid", null);
    }
    const decryptedToken = await decryptAES(encryptedToken);
    const { email, password, name, phone_number, role, ...userData } = reqBody

    if (!email || !password || !name || !phone_number || !role) {
        return responseFormat(400, "All fields are required", null);
    }

    const checkuser = await prisma.user.findFirst({
        where: {
            email: {
                equals: reqBody.email,
                mode: 'insensitive',
            }
        }
    })

    if (checkuser) {
        return responseFormat(400, "Email address is already in use, please login", null);
    }

    try {
        const decodedToken = await verify(decryptedToken, process.env.JWT_ACCESS_TOKEN_SECRET!)
        const newUser = await prisma.user.create({
            data: {
                ...userData,
                email: email,
                password: await encryptAES(password),
                phone_number: await encryptAES(phone_number),
                role: (decodedToken as any).role,
                name: name,
            }
        });

        if (!newUser) {
            return responseFormat(400, "An error occurred while saving user data", null);
        }
        newUser.password = "[PASSWORD IS HIDDEN]"
        await redisClient.del(`registerToken:${encryptedToken}`)
        return responseFormat(201, "User created successfully", newUser, undefined, "/login");
    } catch {
        return responseFormat(400, "Invalid or expired registration token", null);
    }
}