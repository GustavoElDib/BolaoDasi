//arquivo para definir a interface de um jogo, com os atributos vindos da API
export interface Match {
    id: number;
    utcDate: string;
    status: string; 
    stage: string;
    group?: string;
    homeTeam: { name: string; crest?: string; };
    awayTeam: { name: string; crest?: string; };
    score: {
        fullTime: {
            home: number | null;
            away: number | null;
        };
    };
}