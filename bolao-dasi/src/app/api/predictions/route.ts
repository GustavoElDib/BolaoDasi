// Rota que recebe os palpites do usuário e salva no banco, ou atualiza se já existir
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { gameId, palpiteCasa, palpiteFora } = body;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        const partida = await prisma.partida.findUnique({
            where: { apiFootballId: Number(gameId) },
        });

        if (!partida) {
            return NextResponse.json(
                { error: "Partida não encontrada" },
                { status: 404 }
            );
        }

        // Verificação de status no servidor — impede palpites mesmo via fetch manual
        // O frontend também bloqueia, mas essa é a barreira real de segurança
        if (partida.status === "FINISHED" || partida.status === "IN_PLAY") {
            return NextResponse.json(
                { error: "Palpites encerrados para esta partida." },
                { status: 403 }
            );
        }

        // Verifica a regra de 1 hora antes do jogo
        const umaHoraEmMs = 60 * 60 * 1000;
        const agoraMs = Date.now();
        const jogoMs = new Date(partida.dataPartida).getTime();

        if (jogoMs - agoraMs < umaHoraEmMs) {
            return NextResponse.json(
                { error: "Palpites encerrados. Falta menos de 1 hora para o jogo." },
                { status: 403 }
            );
        }

        // Atualiza palpite existente ou cria novo
        const existing = await prisma.palpite.findUnique({
            where: {
                usuarioID_partidaID: {
                    usuarioID: user.id,
                    partidaID: partida.id,
                },
            },
        });

        if (existing) {
            await prisma.palpite.update({
                where: { id: existing.id },
                data: {
                    palpiteTimeCas: palpiteCasa,
                    palpiteTimeFor: palpiteFora,
                },
            });
            return NextResponse.json({ success: true, updated: true });
        }

        await prisma.palpite.create({
            data: {
                usuarioID: user.id,
                partidaID: partida.id,
                palpiteTimeCas: palpiteCasa,
                palpiteTimeFor: palpiteFora,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao salvar palpite" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        const palpites = await prisma.palpite.findMany({
            where: { usuarioID: user.id },
        });

        return NextResponse.json(palpites);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao buscar palpites" },
            { status: 500 }
        );
    }
}