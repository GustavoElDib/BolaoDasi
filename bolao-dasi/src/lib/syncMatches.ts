import { prisma } from "@/lib/prisma";
import { getWorldCupMatches } from "@/services/footballData";

// Tipo para o score retornado pela API football-data.org
interface ScorePartida {
    duration?: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT" | null;
    fullTime?: { home: number | null; away: number | null } | null;
    regularTime?: { home: number | null; away: number | null } | null;
    extraTime?: { home: number | null; away: number | null } | null;
    penalties?: { home: number | null; away: number | null } | null;
}

// Extrai o placar do tempo regular, ignorando prorrogação e pênaltis.
// A API football-data.org tem 3 comportamentos diferentes:
// 1. REGULAR: fullTime já é o tempo normal, regularTime não existe
// 2. PENALTY_SHOOTOUT: regularTime vem preenchido corretamente (ex: Germany x Paraguay)
// 3. EXTRA_TIME: regularTime existe mas vem null — precisamos subtrair extraTime do fullTime (ex: Belgium x Senegal)
function getPlacarRegular(score: ScorePartida | null | undefined): { home: number | null; away: number | null } {
    const fullHome = score?.fullTime?.home ?? null;
    const fullAway = score?.fullTime?.away ?? null;

    // Jogo decidido nos 90min — fullTime já é o tempo regular
    if (score?.duration === "REGULAR") {
        return { home: fullHome, away: fullAway };
    }

    // API preencheu regularTime corretamente (caso PENALTY_SHOOTOUT)
    const regHome = score?.regularTime?.home ?? null;
    const regAway = score?.regularTime?.away ?? null;
    if (regHome != null && regAway != null) {
        return { home: regHome, away: regAway };
    }

    // API deixou regularTime nulo mas temos extraTime (caso EXTRA_TIME)
    // Tempo regular = fullTime - extraTime
    const etHome = score?.extraTime?.home ?? null;
    const etAway = score?.extraTime?.away ?? null;
    if (etHome != null && etAway != null && fullHome != null && fullAway != null) {
        return { home: fullHome - etHome, away: fullAway - etAway };
    }

    // Fallback: usa fullTime (melhor que null)
    return { home: fullHome, away: fullAway };
}

export async function syncMatches() {
    const matches = await getWorldCupMatches();

    for (const match of matches) {
        if (!match.homeTeam?.name || !match.awayTeam?.name) continue;

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

        // Placar do TEMPO REGULAR — lógica centralizada na função getPlacarRegular
        const placar = getPlacarRegular(match.score as ScorePartida);
        const placarCasaReal = placar.home;
        const placarForaReal = placar.away;

        // Upsert da partida — cria se não existir, atualiza status e placar se existir
        await prisma.partida.upsert({
            where: { apiFootballId: match.id },
            update: {
                status: match.status,
                placarCasaReal,
                placarForaReal,
            },
            create: {
                apiFootballId: match.id,
                dataPartida: new Date(match.utcDate),
                status: match.status,
                placarCasaReal,
                placarForaReal,
                faseID: fase.id,
                timeUmID: mandante.id,
                timeDoisID: visitante.id,
            },
        });
    }
}