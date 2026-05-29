// Arquivo que exibe os jogos e os filtros para os palpites
"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/card/card";
import { Match } from "@/types/match";
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

export function GamesContent({ matches, predictions }: Props) {
    // estado do filtro ativo(todos, já palpitados ou não palpitados)
    const [filter, setFilter] = useState<
        "all" | "predicted" | "not_predicted"
    >("all");

    // transforma o array de palpites em um Map para buscas O(1)
    // a chave é o partidaID (= apiFootballId da partida)
    const predictionsMap = useMemo(() => {
        return new Map(
            predictions.map((prediction) => [
                prediction.partidaID,
                prediction,
            ])
        );
    }, [predictions]);

    // filtra os jogos de acordo com o filtro ativo
    // useMemo evita recalcular quando outros estados mudam
    const filteredMatches = useMemo(() => {
        if (filter === "all") return matches;

        if (filter === "predicted") {
            // mostra só os jogos que têm palpite no Map
            return matches.filter((match) => predictionsMap.has(match.id));
        }

        // mostra só os jogos que não têm palpite no Map
        return matches.filter((match) => !predictionsMap.has(match.id));
    }, [filter, matches, predictionsMap]);

    return (
        <>
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


            <div className={styles.grid}>
                {filteredMatches.length === 0 ? (
                    <p className={styles.empty}>
                        Nenhum jogo encontrado para este filtro.
                    </p>
                ) : (
                    filteredMatches.map((match) => (
                        <Card
                            key={match.id}
                            match={match}
                            // passa o palpite existente se o usuário já palpitou neste jogo
                            prediction={predictionsMap.get(match.id)}
                        />
                    ))
                )}
            </div>
        </>
    );
}