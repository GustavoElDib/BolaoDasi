import { prisma } from "@/lib/prisma";
import { getWorldCupMatches } from "@/services/footballData";

export async function syncMatches() {
    const matches = await getWorldCupMatches();

    for (const match of matches) {
        if (!match.homeTeam?.name || !match.awayTeam?.name) continue;

        // LOG TEMPORÁRIO — remover depois de confirmar a estrutura
        if (
            match.homeTeam.name.includes("Germany") ||
            match.awayTeam.name.includes("Germany") ||
            match.homeTeam.name.includes("Paraguay") ||
            match.awayTeam.name.includes("Paraguay")
        ) {
            console.log("=== JOGO ALEMANHA/PARAGUAI ===");
            console.log("ID:", match.id);
            console.log("Times:", match.homeTeam.name, "x", match.awayTeam.name);
            console.log("Status:", match.status);
            console.log("Score completo:", JSON.stringify(match.score, null, 2));
        }

        // Cria/atualiza fase
        const fase = await prisma.fase.upsert({
            where: { nome: match.stage },
            update: {},
            create: { nome: match.stage, peso: 1 },
        });

        // Cria/atualiza time mandante com crest
        const mandante = await prisma.timeFutebol.upsert({
            where: { nome: match.homeTeam.name },
            update: { crest: match.homeTeam.crest || null },
            create: {
                nome: match.homeTeam.name,
                codigo: match.homeTeam.tla || "",
                crest: match.homeTeam.crest || null,
            },
        });

        // Cria/atualiza time visitante com crest
        const visitante = await prisma.timeFutebol.upsert({
            where: { nome: match.awayTeam.name },
            update: { crest: match.awayTeam.crest || null },
            create: {
                nome: match.awayTeam.name,
                codigo: match.awayTeam.tla || "",
                crest: match.awayTeam.crest || null,
            },
        });

        // Upsert da partida — cria se não existir, atualiza status e placar se existir
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