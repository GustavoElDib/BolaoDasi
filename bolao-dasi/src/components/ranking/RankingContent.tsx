// Arquivo que exibe os jogos e os filtros para os palpites
"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/card/card";
import { Match } from "@/types/match";
import { EmptyAnimation } from "@/components/animations/EmptyAnimations";
import styles from "./games.module.css";

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

// Mensagens de estado vazio por filtro
const EMPTY_MESSAGES = {
    all: "Nenhum jogo disponível.",
    predicted: "Ops! Você ainda não fez nenhum palpite...",
    not_predicted: "Você já palpitou em todos os jogos!",
};

export function GamesContent({ matches, predictions }: Props) {
    // Estado do filtro ativo: todos, já palpitados ou não palpitados
    const [filter, setFilter] = useState<
        "all" | "predicted" | "not_predicted"
    >("all");

    // Transforma o array de palpites em um Map para buscas O(1)
    // A chave é o partidaID (= apiFootballId da partida)
    const predictionsMap = useMemo(() => {
        return new Map(
            predictions.map((prediction) => [
                prediction.partidaID,
                prediction,
            ])
        );
    }, [predictions]);

    // Filtra os jogos de acordo com o filtro ativo
    // useMemo evita recalcular quando outros estados mudam
    const filteredMatches = useMemo(() => {
        if (filter === "all") return matches;

        if (filter === "predicted") {
            // Mostra só os jogos que têm palpite no Map
            return matches.filter((match) => predictionsMap.has(match.id));
        }

        // Mostra só os jogos que NÃO têm palpite no Map
        return matches.filter((match) => !predictionsMap.has(match.id));
    }, [filter, matches, predictionsMap]);

    return (
        <>
            {/* Barra de filtros */}
            <div className={styles.filters}>
                <button
                    onClick={() => setFilter("all")}
                    className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""
                        }`}
                >
                    Todos ({matches.length})
                </button>

                <button
                    onClick={() => setFilter("predicted")}
                    className={`${styles.filterBtn} ${filter === "predicted" ? styles.filterBtnActive : ""
                        }`}
                >
                    Já palpitados ({predictionsMap.size})
                </button>

                <button
                    onClick={() => setFilter("not_predicted")}
                    className={`${styles.filterBtn} ${filter === "not_predicted" ? styles.filterBtnActive : ""
                        }`}
                >
                    Não palpitados ({matches.length - predictionsMap.size})
                </button>
            </div>

            {/* Grid de cards ou estado vazio com animação */}
            {filteredMatches.length === 0 ? (
                // Estado vazio — só aparece nos filtros "palpitados" e "não palpitados"
                // O filtro "todos" nunca fica vazio enquanto houver jogos no banco
                <div className={styles.emptyState}>
                    <EmptyAnimation />
                    <p className={styles.emptyText}>
                        {EMPTY_MESSAGES[filter]}
                    </p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredMatches.map((match) => (
                        <Card
                            key={match.id}
                            match={match}
                            // Passa o palpite existente se o usuário já palpitou neste jogo
                            prediction={predictionsMap.get(match.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}