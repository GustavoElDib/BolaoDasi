import bcrypt from "bcrypt";

import { prisma }
    from "@/lib/prisma";

import { NextResponse }
    from "next/server";

export async function POST(
    req: Request
) {

    const body =
        await req.json();

    const tokenData =
        await prisma
            .passwordResetToken
            .findUnique({
                where: {
                    token: body.token,
                },
            });

    if (
        !tokenData ||
        tokenData.expiresAt < new Date()
    ) {

        return NextResponse.json(
            {
                error:
                    "Token inválido",
            },
            {
                status: 400,
            }
        );

    }

    const senhaHash =
        await bcrypt.hash(
            body.senha,
            10
        );

    await prisma.user.update({
        where: {
            email:
                tokenData.email,
        },

        data: {
            senha: senhaHash,
        },
    });

    await prisma
        .passwordResetToken
        .delete({
            where: {
                id: tokenData.id,
            },
        });

    return NextResponse.json({
        success: true,
    });

}