//rota que recebe os palpites do usuário e salva no banco de dados, ou atualiza se já existir um palpite para aquela partida
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions }
    from "@/lib/auth";

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

        const {
            gameId,
            palpiteCasa,
            palpiteFora,
        } = body;

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        // busca a partida pelo id da API
        const partida = await prisma.partida.findUnique({
            where: { apiFootballId: Number(gameId) }
        });

        if (!partida) {
            return NextResponse.json(
                { error: "Partida não encontrada" },
                { status: 404 }
            );
        }

        // verifica se já existe
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
                where: {
                    id: existing.id,
                },
                data: {
                    palpiteTimeCas: palpiteCasa,
                    palpiteTimeFor: palpiteFora,
                },
            });

            return NextResponse.json({
                success: true,
                updated: true,
            });
        }

        // cria
        await prisma.palpite.create({
            data: {
                usuarioID: user.id,
                partidaID: partida.id,
                palpiteTimeCas: palpiteCasa,
                palpiteTimeFor: palpiteFora,
            },
        });

        return NextResponse.json({
            success: true,
        });

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
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        const palpites = await prisma.palpite.findMany({
            where: {
                usuarioID: user.id,
            },
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