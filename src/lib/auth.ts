import { sign, verify } from '@/lib/jwt'
import { encryptAES } from "./aes";
import redisClient from "@/utils/redis";

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!
export async function setSession(userId: string, name:string, role: string) {
    try {
        const accessToken = await sign({ id: userId, name:name, role: role }, ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = await sign({ id: userId,name:name , role: role }, REFRESH_SECRET, { expiresIn: '1d' });

        return setCookies(accessToken, refreshToken, userId);
    } catch {
        throw new Error("Token Generation Failed");
    }
}

export async function setCookies(accessToken: string, refreshToken: string, userID: string) {
    const cookiesToSet = [
        {
            name: "accessToken",
            value: accessToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60,
                path: "/"
            }
        },
        {
            name: "refreshToken",
            value: refreshToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1 * 24 * 60 * 60,
                path: "/"
            }
        }
    ]

    await redisClient.set(`refreshToken:${await encryptAES(userID)}`, refreshToken, { ex: 1 * 24 * 60 * 60 });
    return cookiesToSet;
}

export async function updateAccessToken(refreshToken: string) {
    try {
        const decodedRefreshToken = await verify(refreshToken, REFRESH_SECRET);
        const newAccessToken = await sign({ id: (decodedRefreshToken as any).id, name:(decodedRefreshToken as any).name, role: (decodedRefreshToken as any).role }, ACCESS_SECRET, { expiresIn: '15m' });

        const cookiesToSet = [
            {
                name: "accessToken",
                value: newAccessToken,
                options: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60,
                    path: "/"
                }
            }
        ]

        return cookiesToSet;
    } catch {
        throw new Error("Invalid refresh token");
    }
}

export async function createRegisterToken(role: string, duration: number) {
    const token = await sign({ role: role }, ACCESS_SECRET, { expiresIn: `${duration}s` })

    await redisClient.set(`registerToken:${await encryptAES(token)}`, token, { ex: duration });
    return token;
}