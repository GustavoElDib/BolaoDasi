"use client";

import styles from "./card.module.css";
import Image from "next/image";
import { Match } from "@/types/match";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/toast/Toast";

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

    // formata a data e hora no padrão brasileiro
    const formattedDate = date.toLocaleDateString("pt-BR");
    const formattedTime = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // palpite só é permitido se o jogo não começou e não terminou
    const isBetOpen =
        match.status !== "FINISHED" && match.status !== "IN_PLAY";

    const [loading, setLoading] = useState(false);

    // inicializa os inputs com o palpite existente (se já tiver feito antes)
    const [homeScore, setHomeScore] = useState(
        prediction ? String(prediction.palpiteTimeCas) : ""
    );

    const [awayScore, setAwayScore] = useState(
        prediction ? String(prediction.palpiteTimeFor) : ""
    );

    async function savePrediction() {
        // valida se os dois campos foram preenchidos antes de enviar
        if (homeScore === "" || awayScore === "") {
            showToast("Preencha o placar dos dois times.", "error");
            return;
        }

        try {
            setLoading(true);

            // envia o palpite para a rota POST /api/predictions
            // gameId é o apiFootballId
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

            // força o Next a re-buscar os dados do servidor
            // para atualizar o filtro "Já Palpitados"
            router.refresh();
        } catch {
            showToast("Erro ao salvar palpite. Tente novamente.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Toast de feedback */}
            {toast && (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className={styles.card}>
                {/* Cabeçalho: fase/grupo + data */}
                <div className={styles.header}>
                    <div>
                        {/* Exibe o grupo se estiver na fase de grupos,
                            senão exibe o nome da fase */}
                        <span className={styles.group}>
                            {match.group || match.stage}
                        </span>
                    </div>
                    <div className={styles.dateContainer}>
                        <p>{formattedDate}</p>
                        <p className={styles.time}>{formattedTime}</p>
                    </div>
                </div>

                {/* area dos times e inputs de palpite */}
                <div className={styles.teams}>
                    {/* time da casa (mandante) */}
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

                    {/* inputs de placar */}
                    <div className={styles.inputsContainer}>
                        <input
                            type="number"
                            min={0}
                            value={homeScore}
                            onChange={(e) => setHomeScore(e.target.value)}
                            className={styles.input}
                            disabled={!isBetOpen}
                        />
                        <span className={styles.versus}>×</span>
                        <input
                            type="number"
                            min={0}
                            value={awayScore}
                            onChange={(e) => setAwayScore(e.target.value)}
                            className={styles.input}
                            disabled={!isBetOpen}
                        />
                    </div>

                    {/* time visitante */}
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

                {/* divisor decorativo estilo listras de gramado */}
                <div className={styles.grassDivider} />

                {/* linha de resultado real e badge */}
                <div className={styles.resultContainer}>
                    <div>
                        <p className={styles.resultLabel}>Resultado</p>
                        {/* mostra pontos ganhos se o jogo já terminou */}
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
                        {/* verde se ainda pode palpitar, vermelho se encerrou */}
                        <span
                            className={
                                isBetOpen ? styles.open : styles.closed
                            }
                        >
                            {isBetOpen ? "ABERTO" : "ENCERRADO"}
                        </span>
                    </div>
                </div>

                {/* botão de salvar(desabilitado se jogo encerrado ou salvando) */}
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