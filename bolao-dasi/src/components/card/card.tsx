"use client";
//Style
import styles from "./card.module.css";
//Next components
import Image from "next/image";
//Tipos
import { Match } from "@/types/match";
//Props
type Props = {
    match: Match;
};

export function Card({ match }: Props) {

    //pegando a data do jogo da API
    const date = new Date(match.utcDate);

    //função para formatar a data no formato brasileiro
    const formattedDate =
        date.toLocaleDateString("pt-BR");

    //função para formatar a hora no formato brasileiro
    const formattedTime =
        date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });

    //variável que verifica se o palpite pode ser feito, no caso se ele ainda não terminou ou não começou
    const isBetOpen =
        match.status !== "FINISHED" &&
        match.status !== "IN_PLAY";

    return (

        <div className={styles.card}>

            {/* rodada, fase e grupo(se tiver em fase de grupos) */}

            <div className={styles.header}>

                <div>

                    <p className={styles.group}>
                        {match.group || match.stage}
                    </p>

                    <h2 className={styles.stage}>
                        {match.stage}
                    </h2>

                </div>


                {/* data e hora do jogo */}
                <div className={styles.dateContainer}>

                    <p>
                        {formattedDate}
                    </p>

                    <p className={styles.time}>
                        {formattedTime}
                    </p>

                </div>

            </div>

            {/* times */}

            <div className={styles.teams}>

                {/* time da casa */}

                <div className={styles.team}>

                    {match.homeTeam.crest && (
                        <Image
                            src={match.homeTeam.crest}
                            alt={match.homeTeam.name}
                            width={60}
                            height={60}
                        />
                    )}

                    <span>
                        {match.homeTeam.name}
                    </span>

                </div>

                {/* inputs para palpites */}

                <div className={styles.inputsContainer}>

                    <input
                        type="number"
                        min={0}
                        className={styles.input}
                    />

                    <span className={styles.versus}>
                        X
                    </span>

                    <input
                        type="number"
                        min={0}
                        className={styles.input}
                    />

                </div>

                {/* time visitante */}

                <div className={styles.team}>

                    {match.awayTeam.crest && (
                        <Image
                            src={match.awayTeam.crest}
                            alt={match.awayTeam.name}
                            width={60}
                            height={60}
                        />
                    )}

                    <span>
                        {match.awayTeam.name}
                    </span>

                </div>

            </div>

            {/* resultado da partida */}

            <div className={styles.resultContainer}>

                <div>

                    <p className={styles.resultLabel}>
                        Resultado
                    </p>

                    <p className={styles.result}>

                        {match.score?.fullTime?.homeTeam ?? "-"}

                        {" x "}

                        {match.score?.fullTime?.awayTeam ?? "-"}

                    </p>

                </div>

                <div>

                    <p className={styles.resultLabel}>
                        Palpite
                    </p>

                    <p
                        className={
                            isBetOpen
                                ? styles.open
                                : styles.closed
                        }
                    >
                        {isBetOpen
                            ? "ABERTO"
                            : "ENCERRADO"}
                    </p>

                </div>

            </div>

            {/* botão de salvar palpite */}

            <button
                disabled={!isBetOpen}
                className={styles.button}
            >
                Salvar Palpite
            </button>

        </div>

    );
}