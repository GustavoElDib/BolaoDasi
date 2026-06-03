// Rota que deleta um usuário — acessível apenas pelo moderador
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MODERATOR_EMAIL = process.env.MODERATOR_EMAIL;

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Não autenticado." },
            { status: 401 }
        );
    }

    if (session.user.email !== MODERATOR_EMAIL) {
        return NextResponse.json(
            { error: "Acesso negado." },
            { status: 403 }
        );
    }

    const { id } = await context.params;

    const userToDelete = await prisma.user.findUnique({ where: { id } });

    if (!userToDelete) {
        return NextResponse.json(
            { error: "Usuário não encontrado." },
            { status: 404 }
        );
    }

    if (userToDelete.email === MODERATOR_EMAIL) {
        return NextResponse.json(
            { error: "Não é possível deletar o moderador." },
            { status: 400 }
        );
    }

    // Deleta em ordem para respeitar as chaves estrangeiras:
    // 1. Palpites do usuário (referenciam Partida e User)
    // 2. Sessions e Accounts do NextAuth (referenciam User)
    // 3. Por fim o próprio usuário
    await prisma.$transaction([
        prisma.palpite.deleteMany({ where: { usuarioID: id } }),
        prisma.session.deleteMany({ where: { userId: id } }),
        prisma.account.deleteMany({ where: { userId: id } }),
        prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
}