import { verify } from "jsonwebtoken";
import { Context } from "./db.js";

export const APP_SECRET = "sangatrahasia1234";

interface Token {
  userId: string;
  role: string;
}

export function getUser(context: Context) {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const verifiedToken = verify(token, APP_SECRET) as Token;
    return verifiedToken && verifiedToken;
  }
}
