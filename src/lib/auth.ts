import { UserSchema } from "@/models/schemas";
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";
import { encryptAES } from "./aes";
import redisClient from "@/utils/redis";


export async function generateToken(user: UserSchema) {
    if (!process.env.JWT_TOKEN_SECRET || !process.env.JWT_REFRESH_TOKEN_SECRET) {
        throw new Error("JWT token secret is not set");
    }

    try {
        const accessToken = jwt.sign({ id:user.id, role: user.role }, process.env.JWT_TOKEN_SECRET, { expiresIn:'15m' });
        const refreshToken = jwt.sign({ id:user.id, role:user.role }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn:'1d' });

        return {accessToken, refreshToken};
    } catch {
        throw new Error("Token Generation Failed");
    }
}

export async function setCookies(accessToken:string, refreshToken:string, userID:string) {
    const cookieStore = await cookies();
    // SET accessToke   n cookie for 15 minutes
    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60
    })

    redisClient.set(`refreshToken:${encryptAES(userID)}`, refreshToken, 'EX', 1 * 24 * 60 * 60);
}

export async function sendToken(user:UserSchema) {
    const {accessToken, refreshToken} = await generateToken(user);
    await setCookies(accessToken, refreshToken, user.id);
}