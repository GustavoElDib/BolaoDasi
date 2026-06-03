import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GamesContent } from "@/components/games/GamesContent";
import { Match } from "@/types/match";
import styles from "./page.module.css";

export default async function GamesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) redirect("/login");

    // Busca apenas os dados essenciais — sem relações pesadas desnecessárias
    const [partidas, palpites] = await Promise.all([
        prisma.partida.findMany({
            select: {
                apiFootballId: true,
                dataPartida: true,
                status: true,
                placarCasaReal: true,
                placarForaReal: true,
                timeMandante: { select: { nome: true, crest: true } },
                timeVisitante: { select: { nome: true, crest: true } },
                fase: { select: { nome: true } },
            },
            orderBy: { dataPartida: "asc" },
        }),
        prisma.palpite.findMany({
            where: { usuarioID: user.id },
            select: {
                palpiteTimeCas: true,
                palpiteTimeFor: true,
                pontosGanho: true,
                partida: { select: { apiFootballId: true } },
            },
        }),
    ]);

    const palpitesMapped = palpites.map((p) => ({
        partidaID: p.partida.apiFootballId,
        palpiteTimeCas: p.palpiteTimeCas,
        palpiteTimeFor: p.palpiteTimeFor,
        pontosGanho: p.pontosGanho,
    }));

    const matches: Match[] = partidas.map((partida) => ({
        id: partida.apiFootballId,
        utcDate: partida.dataPartida.toISOString(),
        status: partida.status,
        stage: partida.fase.nome,
        homeTeam: {
            name: partida.timeMandante.nome,
            crest: partida.timeMandante.crest ?? undefined,
        },
        awayTeam: {
            name: partida.timeVisitante.nome,
            crest: partida.timeVisitante.crest ?? undefined,
        },
        score: {
            fullTime: {
                home: partida.placarCasaReal ?? null,
                away: partida.placarForaReal ?? null,
            },
        },
    }));

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Seus Palpites</h1>
                    <p className={styles.pageSubtitle}>
                        Os palpites encerram{" "}
                        <strong>1 hora</strong>{" "}
                        antes do início de cada jogo.
                    </p>
                </div>

                {/* Todos os jogos chegam de uma vez — o "ver mais" é só no cliente */}
                <GamesContent
                    matches={matches}
                    predictions={palpitesMapped}
                />
            </div>
        </div>
    );
}