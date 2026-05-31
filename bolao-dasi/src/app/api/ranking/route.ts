//rota que retorna o ranking geral dos usuários, ordenado por pontos ganhos

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// pesos de cada fase
const PESOS_FASE: Record<string, number> = {
    "GROUP_STAGE": 1,
    "ROUND_OF_16": 2,
    "QUARTER_FINALS": 3,
    "SEMI_FINALS": 4,
    "FINAL": 5,
};

// calcula pontos brutos (sem multiplicador de acordo com a fase)
function calcularPontosBrutos(
    palpiteCasa: number,
    palpiteFora: number,
    realCasa: number,
    realFora: number
): number {
    // placar exato
    if (palpiteCasa === realCasa && palpiteFora === realFora) {
        return 3;
    }

    // acertou vencedor ou empate
    const palpiteResultado = Math.sign(palpiteCasa - palpiteFora);
    const realResultado = Math.sign(realCasa - realFora);

    if (palpiteResultado === realResultado) {
        return 1;
    }

    return 0;
}

// calcula pontos com multiplicador de fase
export function calcularPontos(
    palpiteCasa: number,
    palpiteFora: number,
    realCasa: number,
    realFora: number,
    nomesFase: string
): number {
    const pontosBrutos = calcularPontosBrutos(
        palpiteCasa,
        palpiteFora,
        realCasa,
        realFora
    );

    const peso = PESOS_FASE[nomesFase] ?? 1;

    return pontosBrutos * peso;
}

// função que atualiza os pontos de todos os palpites de uma partida finalizada
// chamar isso após uma partida ser marcada como FINISHED
export async function atualizarPontosPartida(partidaId: number) {
    const partida = await prisma.partida.findUnique({
        where: { id: partidaId },
        include: {
            fase: true,
            palpites: true,
        },
    });

    if (!partida) throw new Error("Partida não encontrada");

    if (partida.status !== "FINISHED") {
        throw new Error("Partida ainda não finalizada");
    }

    if (
        partida.placarCasaReal === null ||
        partida.placarForaReal === null
    ) {
        throw new Error("Placar real não registrado");
    }

    // atualiza cada palpite da partida
    await Promise.all(
        partida.palpites.map((palpite) => {
            const pontos = calcularPontos(
                palpite.palpiteTimeCas,
                palpite.palpiteTimeFor,
                partida.placarCasaReal!,
                partida.placarForaReal!,
                partida.fase.nome
            );

            return prisma.palpite.update({
                where: { id: palpite.id },
                data: { pontosGanho: pontos },
            });
        })
    );
}

// função que retorna o ranking geral dos usuários
export async function getRanking() {
    const usuarios = await prisma.user.findMany({
        include: {
            palpites: true,
        },
    });

    const ranking = usuarios
        .map((user) => ({
            id: user.id,
            nome: user.nome,
            totalPontos: user.palpites.reduce(
                (acc, p) => acc + (p.pontosGanho ?? 0),
                0
            ),
            totalPalpites: user.palpites.length,
        }))
        .sort((a, b) => b.totalPontos - a.totalPontos);

    return ranking;
}

// rota GET para retorno do JSON getRanking
export async function GET() {
    try
    {
        const ranking = await getRanking();
        return NextResponse.json(ranking, { status: 200 });
    }
    catch (error)
    {
        console.error("Erro na rota de ranking:", error);
        return NextResponse.json(
            { error: "Erro interno ao carregar o ranking." },
            { status: 500 }
        );
    }
}