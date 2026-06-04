// Rota de sync — chamada pelo cron job da Vercel a cada 3 horas
// Protegida pelo header Authorization que a Vercel injeta automaticamente
// Sem secrets expostos no código ou no vercel.json
import { NextRequest, NextResponse } from "next/server";
import { syncMatches } from "@/lib/syncMatches";
import { atualizarPontosPartida } from "../../ranking/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    // A Vercel injeta automaticamente o header Authorization: Bearer <CRON_SECRET>
    // em todas as chamadas de cron job — não precisa colocar nada na URL
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { error: "Não autorizado." },
            { status: 401 }
        );
    }

    try {
        // 1. Sincroniza partidas com a API externa
        await syncMatches();

        // 2. Busca partidas finalizadas com palpites sem pontos calculados
        const partidasParaCalcular = await prisma.partida.findMany({
            where: {
                status: "FINISHED",
                palpites: { some: { pontosGanho: null } },
            },
            select: { id: true },
        });

        // 3. Calcula e salva os pontos
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