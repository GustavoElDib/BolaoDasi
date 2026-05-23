export interface Match {
    id: number;

    utcDate: string;

    status: string;

    stage: string;

    group?: string;

    homeTeam: {
        name: string;
        crest?: string;
    };

    awayTeam: {
        name: string;
        crest?: string;
    };

    score: {
        fullTime: {
            homeTeam: number | null;
            awayTeam: number | null;
        };
    };
}