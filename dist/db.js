import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
export function createContext(req) {
    return {
        req,
        prisma
    };
}
