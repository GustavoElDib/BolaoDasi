//arquivo para sincronizar as partidas da copa do mundo com a base de dados local usando o prisma
import { prisma } from "@/lib/prisma";
import { getWorldCupMatches } from "@/services/footballData";

export async function syncMatches() {
    const matches = await getWorldCupMatches();

    for (const match of matches) {
        if (!match.homeTeam?.name || !match.awayTeam?.name) {
            continue;
        }

        // cria/busca fase
        const fase = await prisma.fase.upsert({
            where: { nome: match.stage },
            update: {},
            create: { nome: match.stage, peso: 1 },
        });

        // cria/busca time mandante
        const mandante = await prisma.timeFutebol.upsert({
            where: { nome: match.homeTeam.name },
            update: {
                crest: match.homeTeam.crest || null,  // atualiza se mudar
            },
            create: {
                nome: match.homeTeam.name,
                codigo: match.homeTeam.tla || "",
                crest: match.homeTeam.crest || null,
            },
        });

        // cria/busca visitante 
        const visitante = await prisma.timeFutebol.upsert({
            where: { nome: match.awayTeam.name },
            update: {
                crest: match.awayTeam.crest || null,
            },
            create: {
                nome: match.awayTeam.name,
                codigo: match.awayTeam.tla || "",
                crest: match.awayTeam.crest || null,
            },
        });

        // upsert da partida
        await prisma.partida.upsert({
            where: { apiFootballId: match.id },
            update: {
                status: match.status,
                placarCasaReal: match.score?.fullTime?.home ?? null,
                placarForaReal: match.score?.fullTime?.away ?? null,
            },
            create: {
                apiFootballId: match.id,
                dataPartida: new Date(match.utcDate),
                status: match.status,
                placarCasaReal: match.score?.fullTime?.home ?? null,
                placarForaReal: match.score?.fullTime?.away ?? null,
                faseID: fase.id,
                timeUmID: mandante.id,
                timeDoisID: visitante.id,
            },
        });
    }
}