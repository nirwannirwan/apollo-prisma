import { verify } from "jsonwebtoken";
export const APP_SECRET = "sangatrahasia1234";
export function getUser(context) {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const verifiedToken = verify(token, APP_SECRET);
        return verifiedToken && verifiedToken;
    }
}
