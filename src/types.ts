export interface Player {
  id: number;
  name: string;
  score: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Match {
  id: number;
  team1: number[];
  team2: number[];
  score1: number;
  score2: number;
  created_at: string;
}
