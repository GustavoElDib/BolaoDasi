const BASE_URL = "https://api.football-data.org/v4";

export async function getWorldCupMatches() {
    const response = await fetch(
        `${BASE_URL}/competitions/WC/matches`,
        {
            headers: {
                "X-Auth-Token":
                    process.env.FOOTBALL_DATA_API_KEY!,
            },

            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar jogos");
    }

    const data = await response.json();

    console.log(data);
    return data.matches;
}