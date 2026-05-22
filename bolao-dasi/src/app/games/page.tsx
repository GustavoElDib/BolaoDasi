import Image from "next/image";

import { Match } from "@/types/match";
import { getWorldCupMatches } from "@/services/footballData";

export default async function GamesPage() {
    const matches = await getWorldCupMatches();

    return (
        <main className="min-h-screen p-8">

            <h1 className="text-4xl font-bold mb-8">
                Jogos da Copa ⚽
            </h1>

            <div className="flex flex-col gap-4">

                {matches.map((match: Match) => (
                    <div
                        key={match.id}
                        className="
                            border
                            border-zinc-800
                            rounded-xl
                            p-4
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                {match.homeTeam.crest && (
                                    <Image
                                        src={match.homeTeam.crest}
                                        alt={match.homeTeam.name}
                                        width={40}
                                        height={40}
                                    />
                                )}

                                {
                                match.status === "TIMED" && 
                                    <span>
                                        {match.homeTeam.name + ": 0"}
                                    </span>
                                }


                            </div>

                            {
                            match.homeTeam.crest && match.awayTeam.crest && 
                                <span className="font-bold">
                                    VS
                                </span>
                            }
            

                            <div className="flex items-center gap-3">

                                {
                                match.status === "TIMED" && 
                                    <span>
                                        {match.awayTeam.name + ": 0"}
                                    </span>
                                }

                                {match.awayTeam.crest && (
                                    <Image
                                        src={match.awayTeam.crest}
                                        alt={match.awayTeam.name}
                                        width={40}
                                        height={40}
                                    />
                                )}

                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </main>
    );
}