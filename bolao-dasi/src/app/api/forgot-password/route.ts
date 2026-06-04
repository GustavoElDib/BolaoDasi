//rota que recebe o email do usuário, gera um token de recuperação e envia um email com o link para redefinir a senha
import { prisma }
    from "@/lib/prisma";

import { NextResponse }
    from "next/server";

import crypto from "crypto";

import { Resend }
    from "resend";

const resend =
    new Resend(
        process.env.RESEND_API_KEY
    );

export async function POST(
    req: Request
) {

    const body =
        await req.json();

    const token =
        crypto.randomUUID();

    const expiresAt =
        new Date(
            Date.now()
            + 1000 * 60 * 30
        );

    await prisma.passwordResetToken.create({
        data: {
            email: body.email,
            token,
            expiresAt,
        },
    });

    const resetLink =
        `http://localhost:3000/reset-password/${token}`;

    await resend.emails.send({
        from:
            "onboarding@resend.dev",

        to: body.email,

        subject:
            "Recuperação de senha do Bolão DASI",

        html: `
            <p>
                Clique no link abaixo para redefinir sua senha do Bolão DASI. Este link é válido por 30 minutos.:
            </p>

            <a href="${resetLink}">
                Redefinir senha
            </a>
        `,
    });

    return NextResponse.json({
        success: true,
    });

}