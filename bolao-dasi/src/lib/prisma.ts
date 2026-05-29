//arquivo para criar uma instância do PrismaClient e garantir que ela seja reutilizada durante o desenvolvimento, evitando a criação de múltiplas conexões com o banco de dados
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}