import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GamesContent } from "@/components/games/GamesContent";
import { Match } from "@/types/match";
import styles from "./page.module.css";

export default async function GamesPage() {
    const session = await getServerSession(authOptions);

    // Redireciona para login se não estiver autenticado
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) redirect("/login");

    // Busca partidas e palpites do usuário em paralelo para melhor performance
    const [partidas, palpites] = await Promise.all([
        prisma.partida.findMany({
            include: {
                timeMandante: true,
                timeVisitante: true,
                fase: true,
            },
            orderBy: { dataPartida: "asc" },
        }),
        prisma.palpite.findMany({
            where: { usuarioID: user.id },
            // Inclui a partida para poder pegar o apiFootballId
            include: { partida: true },
        }),
    ]);

    // Remapeia os palpites usando apiFootballId como chave
    // Isso é necessário porque o Card usa match.id (= apiFootballId)
    // e precisamos que a chave do predictionsMap bata com esse valor
    const palpitesMapped = palpites.map((p) => ({
        partidaID: p.partida.apiFootballId,
        palpiteTimeCas: p.palpiteTimeCas,
        palpiteTimeFor: p.palpiteTimeFor,
        pontosGanho: p.pontosGanho,
    }));

    // Converte os dados do banco para o formato Match esperado pelo Card
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
                {/* Cabeçalho da página */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Seus Palpites</h1>
                    <p className={styles.pageSubtitle}>
                        Os palpites encerram{" "}
                        <strong>1 hora</strong>{" "}
                        antes do início de cada jogo.
                    </p>
                </div>

                {/* Componente client-side com filtros e grid de cards */}
                <GamesContent
                    matches={matches}
                    predictions={palpitesMapped}
                />
            </div>
        </div>
    );
}