import { UserSchema } from "@/models/schemas";
import { NextRequest } from "next/server";
import { verify } from "./jwt";

export function getUserDataClient() {
    const user = JSON.parse(localStorage.getItem("authUser")!);
    const parsedUser = UserSchema.partial().parse(user)

    return parsedUser;
}

export async function getUserDataServer(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value

  if (!accessToken) {
    return null;
  }

  const decodedToken = await verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!)

  if (!decodedToken) {
    return null;
  }
  return UserSchema.partial().parse(decodedToken as any);
}