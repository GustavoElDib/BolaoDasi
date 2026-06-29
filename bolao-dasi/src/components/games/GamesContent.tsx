"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/card/card";
import { Match } from "@/types/match";
import { EmptyAnimation } from "@/components/animations/EmptyAnimations";
import styles from "../../app/games/page.module.css";

// Quantos cards mostrar inicialmente e a cada "ver mais"
const PAGE_SIZE = 12;

type Prediction = {
    partidaID: number;
    palpiteTimeCas: number;
    palpiteTimeFor: number;
    pontosGanho: number | null;
};

type Props = {
    matches: Match[];
    predictions: Prediction[];
};

const EMPTY_MESSAGES = {
    all: "Nenhum jogo disponível.",
    predicted: "Você ainda não fez nenhum palpite.",
    not_predicted: "Você já palpitou em todos os jogos!",
};

export function GamesContent({ matches, predictions }: Props) {
    const [filter, setFilter] = useState<
        "all" | "predicted" | "not_predicted"
    >("all");

    // Quantos jogos estão visíveis no momento — começa com PAGE_SIZE
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Sempre que o filtro muda, reseta para a primeira "página"
    function handleFilterChange(newFilter: typeof filter) {
        setFilter(newFilter);
        setVisibleCount(PAGE_SIZE);
    }

    // Map de palpites para buscas O(1)
    const predictionsMap = useMemo(() => {
        return new Map(predictions.map((p) => [p.partidaID, p]));
    }, [predictions]);

    // Lista filtrada completa
const filteredMatches = useMemo(() => {
        let result = matches;

        if (filter === "predicted") {
            result = matches.filter((m) => predictionsMap.has(m.id));
        } else if (filter === "not_predicted") {
            result = matches.filter((m) => !predictionsMap.has(m.id));
        }
        return [...result].sort((a, b) => {
            return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
        });
        
    }, [filter, matches, predictionsMap]);

    // Fatia visível — cresce quando o usuário clica em "ver mais"
    const visibleMatches = filteredMatches.slice(0, visibleCount);
    const hasMore = visibleCount < filteredMatches.length;
    const remaining = filteredMatches.length - visibleCount;

    return (
        <>
            {/* Filtros */}
            <div className={styles.filters}>
                <button
                    onClick={() => handleFilterChange("all")}
                    className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""
                        }`}
                >
                    Todos ({matches.length})
                </button>
                <button
                    onClick={() => handleFilterChange("predicted")}
                    className={`${styles.filterBtn} ${filter === "predicted" ? styles.filterBtnActive : ""
                        }`}
                >
                    Já palpitados ({predictionsMap.size})
                </button>
                <button
                    onClick={() => handleFilterChange("not_predicted")}
                    className={`${styles.filterBtn} ${filter === "not_predicted" ? styles.filterBtnActive : ""
                        }`}
                >
                    Não palpitados ({matches.length - predictionsMap.size})
                </button>
            </div>

            {/* Grid ou estado vazio */}
            {filteredMatches.length === 0 ? (
                <div className={styles.emptyState}>
                    <EmptyAnimation />
                    <p className={styles.emptyText}>
                        {EMPTY_MESSAGES[filter]}
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {visibleMatches.map((match) => (
                            <Card
                                key={match.id}
                                match={match}
                                prediction={predictionsMap.get(match.id)}
                            />
                        ))}
                    </div>

                    {/* Botão "ver mais" — só aparece se ainda houver jogos escondidos */}
                    {hasMore && (
                        <div className={styles.loadMore}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={() =>
                                    setVisibleCount((v) => v + PAGE_SIZE)
                                }
                            >
                                Ver mais {Math.min(remaining, PAGE_SIZE)} jogos
                                <span className={styles.loadMoreCount}>
                                    {remaining} restantes
                                </span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}