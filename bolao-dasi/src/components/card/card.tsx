"use client";

import styles from "./card.module.css";
import Image from "next/image";
import { Match } from "@/types/match";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/toast/Toast";

// mapeamento de nomes de fase da API para português + peso multiplicador
// chave = nome que vem do banco, valor = nome legível e peso
const FASES: Record<string, { label: string; peso: number }> = {
    GROUP_STAGE: { label: "Fase de Grupos", peso: 1 },
    LAST_32 : { label: "16-avos de Final", peso: 2 },
    LAST_16 : { label: "Oitavas de Final", peso: 3 },
    QUARTER_FINALS: { label: "Quartas de Final", peso: 4 },
    SEMI_FINALS: { label: "Semifinal", peso: 5 },
    FINAL: { label: "Final", peso: 6 },
};

type Prediction = {
    partidaID: number;
    palpiteTimeCas: number;
    palpiteTimeFor: number;
    pontosGanho: number | null;
};

type Props = {
    match: Match;
    prediction?: Prediction;
};

export function Card({ match, prediction }: Props) {
    const date = new Date(match.utcDate);
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();

    // Formata a data e hora no padrão brasileiro
    const formattedDate = date.toLocaleDateString("pt-BR");
    const formattedTime = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Palpite só é permitido se o jogo não começou e não terminou
    const isBetOpen =
        match.status !== "FINISHED" && match.status !== "IN_PLAY";

    // Busca o nome formatado em português e o peso da fase
    // Usa fallback para o valor bruto caso venha uma fase desconhecida
    const faseInfo = FASES[match.stage] ?? { label: match.stage, peso: 1 };

    const [loading, setLoading] = useState(false);

    // Inicializa os inputs com o palpite existente (se já tiver feito antes)
    const [homeScore, setHomeScore] = useState(
        prediction ? String(prediction.palpiteTimeCas) : ""
    );
    const [awayScore, setAwayScore] = useState(
        prediction ? String(prediction.palpiteTimeFor) : ""
    );

    async function savePrediction() {
        // Valida se os dois campos foram preenchidos antes de enviar
        if (homeScore === "" || awayScore === "") {
            showToast("Preencha o placar dos dois times.", "error");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/predictions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gameId: match.id,
                    palpiteCasa: Number(homeScore),
                    palpiteFora: Number(awayScore),
                }),
            });

            if (!response.ok) throw new Error();

            showToast("Palpite salvo com sucesso!", "success");
            // Força o Next.js a re-buscar os dados do servidor
            router.refresh();
        } catch {
            showToast("Erro ao salvar palpite. Tente novamente.", "error");
        } finally {
            setLoading(false);
        }
    }

    const getInputClass = (type: "home" | "away") => {
    if (homeScore === "" || awayScore === "") return styles.input;
    const home = Number(homeScore);
    const away = Number(awayScore);
    
    if (home === away) return `${styles.input} ${styles.draw}`;
    
    const isWinner = type === "home" ? home > away : away > home;
    return isWinner 
        ? `${styles.input} ${styles.winner}` 
        : `${styles.input} ${styles.loser}`;
    };

    return (
        <>
            {toast && (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            {/* cardClosed escurece o card inteiro quando palpite não é mais possível */}
            <div className={`${styles.card} ${!isBetOpen ? styles.cardClosed : ""}`}>

                {/* Cabeçalho: fase/grupo + peso + data */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        {/* Nome da fase em português */}
                        <span className={styles.group}>
                            {match.group
                                ? `${match.group} · ${faseInfo.label}`
                                : faseInfo.label}
                        </span>
                        {/* Peso multiplicador da fase */}
                        <span className={styles.phaseBadge}>
                            ×{faseInfo.peso}
                        </span>
                    </div>
                    <div className={styles.dateContainer}>
                        <p>{formattedDate}</p>
                        <p className={styles.time}>{formattedTime}</p>
                    </div>
                </div>

                {/* Área dos times e inputs de palpite */}
                <div className={styles.teams}>
                    <div className={styles.team}>
                        {match.homeTeam.crest && (
                            <Image
                                src={match.homeTeam.crest}
                                alt={match.homeTeam.name}
                                width={56}
                                height={56}
                            />
                        )}
                        <span>{match.homeTeam.name}</span>
                    </div>

                    <div className={styles.inputsContainer}>
                        <input
                            type="number"
                            min={0}
                            value={homeScore}
                            onChange={(e) => setHomeScore(e.target.value)}
                            className={getInputClass("home")}
                            disabled={!isBetOpen}
                            suppressHydrationWarning
                        />
                        <span className={styles.versus}>×</span>
                        <input
                            type="number"
                            min={0}
                            value={awayScore}
                            onChange={(e) => setAwayScore(e.target.value)}
                            className={getInputClass("away")}
                            disabled={!isBetOpen}
                            suppressHydrationWarning
                        />
                    </div>

                    <div className={styles.team}>
                        {match.awayTeam.crest && (
                            <Image
                                src={match.awayTeam.crest}
                                alt={match.awayTeam.name}
                                width={56}
                                height={56}
                            />
                        )}
                        <span>{match.awayTeam.name}</span>
                    </div>
                </div>

                

                {/* Linha de resultado real + badge de status */}
                <div className={styles.resultContainer}>
                    <div>
                        <p className={styles.resultLabel}>Resultado</p>
                        {match.status === "FINISHED" && prediction && (
                            <p className={styles.result}>
                                {prediction.pontosGanho ?? 0} pts
                            </p>
                        )}
                        <p className={styles.result}>
                            {match.score?.fullTime?.home ?? "−"}
                            {" × "}
                            {match.score?.fullTime?.away ?? "−"}
                        </p>
                    </div>

                    <div>
                        <p className={styles.resultLabel}>Palpite</p>
                        <span className={isBetOpen ? styles.open : styles.closed}>
                            {isBetOpen ? "ABERTO" : "ENCERRADO"}
                        </span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        disabled={!isBetOpen || loading}
                        onClick={savePrediction}
                        className={styles.button}
                    >
                        {loading ? "Salvando..." : "Salvar Palpite"}
                    </button>
                </div>
            </div>
        </>
    );
}