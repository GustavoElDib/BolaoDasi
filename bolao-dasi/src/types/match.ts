export interface Match {
    id: number;

    homeTeam: {
        name: string;
        crest: string;
    };

    awayTeam: {
        name: string;
        crest: string;
    };

    utcDate: string;

    status: string;

    score: {
        fullTime: {
            homeTeam: number;
            awayTeam: number;
        };
    }
}