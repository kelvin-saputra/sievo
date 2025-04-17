import jwt from 'jsonwebtoken';
import { encryptAES } from "./aes";
import redisClient from "@/utils/redis";

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!
export async function setSession(userId: string, role: string) {
    try {
        const accessToken = jwt.sign({ id: userId, role: role }, ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: userId, role: role }, REFRESH_SECRET, { expiresIn: '1d' });

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

    await redisClient.set(`refreshToken:${encryptAES(userID)}`, refreshToken, 'EX', 1 * 24 * 60 * 60);
    return cookiesToSet;
}

export async function updateAccessToken(refreshToken: string) {
    try {
        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_SECRET);
        const newAccessToken = jwt.sign({ id: (decodedRefreshToken as any).id, role: (decodedRefreshToken as any).role }, ACCESS_SECRET, { expiresIn: '15m' });

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

export async function createRegisterToken(role:string, duration:number) {
    const token = jwt.sign({ role: role }, ACCESS_SECRET, { expiresIn: `${duration}s` })

    await redisClient.set(`registerToken:${encryptAES(token)}`, token, 'EX', duration);
    return token;
}