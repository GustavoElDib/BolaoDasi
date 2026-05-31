import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const STAGE_WEIGHT : Record<string, number> = {
    GROUP_STAGE: 1,
    ROUND_OF_16: 2,
    QUARTER_FINALS: 3,
    SEMI_FINALS: 4,
    FINALS: 5
}

function calculateAllPointsInMatch(golsCasa: number, golsFora: number, golsCasaPalpite: number, golsForaPalpite: number): number{

    if(golsCasa == golsCasaPalpite && golsFora == golsForaPalpite){
        return 3; //acertou tudo
    }

    const resultadoReal = Math.sign(golsCasa - golsFora);
    const resultadoPalpite = Math.sign(golsCasaPalpite - golsForaPalpite);
    if(resultadoReal == resultadoPalpite){
        return 1; //acertou ao menos o vencedor/empate
    }

    return 0; //errou tudo
}

function calculateAllPointsWithStageWeight(allPointsInMatch: number, stage: string) : number{ //calcula os pontos reais usando os pesos da const declarada lá no começo
    const peso = STAGE_WEIGHT[stage] || 1;
    return peso * allPointsInMatch;
}

async function updatePoints(partidaID : number) {
    const partida = await prisma.partida.findUnique({
        where: {id: partidaID},
        include: {palpites: true},
    });

    if(!partida){
        throw new Error("Partida não encontrada!");
    }

    if(partida.status != "FINISHED"){
        throw new Error("Partida não finalizada!");
    }

    if(partida.placarCasaReal == null || partida.placarForaReal == null){
        throw new Error("Partida sem placar!");
    }

    //esse promise.all ta processando tudo usando as funções anteriores e atualizando os pontos
    await Promise.all(
      partida.palpites.map(async (palpite) => {
          const allPointsInMatch = calculateAllPointsInMatch(
              partida.placarCasaReal!, partida.placarForaReal!,
              palpite.palpiteTimeCas!, palpite.palpiteTimeFor!
          );

          const finalPoints = calculateAllPointsWithStageWeight(allPointsInMatch, partida.status); //aq deveria ser partida.fase (o atributo "fase" da tabela
                                                                                                           //Partida, mas por algum motivo n ta achando) :/
          return prisma.palpite.update({
              where: {id: palpite.id},
              data: {pontosGanho: finalPoints},
          })
      })
    );
}

async function getRanking(){
    const users = await prisma.user.findMany({
        include: { palpites: true},
    });

    const ranking = users.map((user) => {
        const totalPoints = user.palpites.reduce((accumulate, palpites) =>{
            return accumulate + (palpites.pontosGanho || 0);
        }, 0); //calcula os pontos ganhos até agora para montar o ranking


        return {
            id: user.id,
            name: user.name,
            totalPoints: totalPoints,
            totalPalpites: user.palpites.length,
        }
    });

    return ranking.sort((a: { totalPoints: number; }, b: { totalPoints: number; }) => b.totalPoints - a.totalPoints);
}

export async function GET(){ //retorno em json do getRanking
    try{
        const rankingData = await getRanking();
        return NextResponse.json(rankingData, {status: 200});
    }catch(error){
        console.error("Erro ao gerar ranking: " + error);
        return NextResponse.json({error: "Erro interno ao gerar ranking"}, {status: 500});
    }
}

