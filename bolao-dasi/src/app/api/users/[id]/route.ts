// rota que deleta um usuário (acessível apenas pelo dasi)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// rmail do moderador
const MODERATOR_EMAIL = process.env.MODERATOR_EMAIL;

export async function DELETE(
    req: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    // verifica se há sessão ativa
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Não autenticado." },
            { status: 401 }
        );
    }

    // verifica se quem faz o DELETE é o moderador
    if (session.user.email !== MODERATOR_EMAIL) {
        return NextResponse.json(
            { error: "Acesso negado." },
            { status: 403 }
        );
    }

    const { id } = await context.params;

    // impede o moderador de deletar a si mesmo por acidente
    const userToDelete = await prisma.user.findUnique({ where: { id } });

    if (userToDelete?.email === MODERATOR_EMAIL) {
        return NextResponse.json(
            { error: "Não é possível deletar o moderador." },
            { status: 400 }
        );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
}