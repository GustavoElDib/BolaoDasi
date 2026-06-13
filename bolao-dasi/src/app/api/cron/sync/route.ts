import { NextResponse } from "next/server";
import { atualizarPontosPartida } from "@/app/api/ranking/route";
import { prisma } from "@/lib/prisma";
import { syncMatches } from "@/lib/syncMatches";

export async function GET(request: Request) {
    // Pega o header de autorização
    const authHeader = request.headers.get("authorization");
    
    // O formato esperado será: "Bearer SEU_CRON_SECRET"
    const expectedAuth = `Bearer ${process.env.CRON_JOB_SECRET}`;

    if (!authHeader || authHeader !== expectedAuth) {
        return new NextResponse("Não autorizado", { status: 401 });
    }

    try {
        await syncMatches();
        
        const partidas = await prisma.partida.findMany({
            where: {
                status: "FINISHED",
                palpites: { some: { pontosGanho: null } },
            },
            select: { id: true },
        });

        for (const p of partidas) {
            await atualizarPontosPartida(p.id);
        }

        return NextResponse.json({ ok: true, message: `Sincronizado! ${partidas.length} partidas.` });
    } catch (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }
}