//Componentes
import { Card } from "@/components/card/card";
//Tipos
import { Match } from "@/types/match";
//Serviços da API
import { getWorldCupMatches } from "@/services/footballData";

export default async function GamesPage() {
    const matches = await getWorldCupMatches();

    return (
        <main className="min-h-screen p-8">

            <h1 className="text-4xl font-bold">
                Seus Palpites
            </h1>

            <p className="text-zinc-400 mt-2 mb-8">
                Os palpites encerram
                {" "}
                <strong>1 hora</strong>
                {" "}
                antes do jogo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {matches.map((match: Match) => (
                    <Card
                        key={match.id}
                        match={match}
                    />
                ))}

            </div>

        </main>
    );
}