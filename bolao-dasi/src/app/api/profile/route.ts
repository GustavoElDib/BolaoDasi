//rota que atualiza o perfil do usuário, permitindo alterar nome e email. Verifica se o email já está em uso por outro usuário antes de atualizar. Retorna erros apropriados para casos de autenticação, validação e conflitos de email
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const { nome, email } = await req.json();

        if (!nome?.trim() || !email?.trim()) {
            return NextResponse.json(
                { error: "Nome e e-mail são obrigatórios." },
                { status: 400 }
            );
        }

        // verifica se o novo email já está em uso por outro usuário
        if (email !== session.user.email) {
            const existing = await prisma.user.findUnique({
                where: { email },
            });

            if (existing) {
                return NextResponse.json(
                    { error: "Este e-mail já está em uso." },
                    { status: 409 }
                );
            }
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: { nome, email },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao atualizar perfil." },
            { status: 500 }
        );
    }
}