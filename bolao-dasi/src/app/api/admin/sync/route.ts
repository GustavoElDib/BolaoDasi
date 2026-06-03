// Rota para sincronizar partidas e calcular pontos de jogos finalizados
// Chamar manualmente ou via cron job (ex: Vercel Cron Jobs)
// Protegida por CRON_SECRET para evitar chamadas não autorizadas
import { NextRequest, NextResponse } from "next/server";
import { syncMatches } from "@/lib/syncMatches";
import { atualizarPontosPartida } from "../../ranking/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    // Verifica o secret para proteger a rota de chamadas externas não autorizadas
    // Configure CRON_SECRET no .env com uma string aleatória longa
    const secret = req.nextUrl.searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json(
            { error: "Não autorizado." },
            { status: 401 }
        );
    }

    try {
        // 1. Sincroniza partidas com a API externa (atualiza status e placares)
        await syncMatches();

        // 2. Busca todas as partidas finalizadas que ainda têm palpites sem pontos
        // Isso evita recalcular partidas que já foram processadas
        const partidasParaCalcular = await prisma.partida.findMany({
            where: {
                status: "FINISHED",
                palpites: {
                    some: { pontosGanho: null },
                },
            },
            select: { id: true },
        });

        // 3. Calcula e salva os pontos para cada partida pendente
        await Promise.all(
            partidasParaCalcular.map((p) => atualizarPontosPartida(p.id))
        );

        return NextResponse.json({
            success: true,
            partidasAtualizadas: partidasParaCalcular.length,
        });

    } catch (error) {
        console.error("Erro no sync:", error);
        return NextResponse.json(
            { error: "Erro ao sincronizar." },
            { status: 500 }
        );
    }
}