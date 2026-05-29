//rota para registrar um novo usuário
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const userExistente = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });

    if (userExistente) {
        return NextResponse.json(
            { error: "Usuário já existe" },
            { status: 400 }
        );
    }

    const senhaHash = await bcrypt.hash(body.senha, 10);

    const user = await prisma.user.create({
        data: {
            nome: body.nome,
            email: body.email,
            senha: senhaHash,
        },
    });

    return NextResponse.json(user);
}