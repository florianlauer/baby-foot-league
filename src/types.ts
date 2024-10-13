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

export interface PlayerStats {
  id: number;
  name: string;
  score: number;
  matches_played: number;
  wins: number;
  losses: number;
  draws: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  win_rate: number;
}

export const mapPlayerStatsToPlayer = (stats: PlayerStats): Player => {
  return {
    id: stats.id,
    name: stats.name,
    score: stats.score,
    matchesPlayed: stats.matches_played,
    wins: stats.wins,
    draws: stats.draws,
    losses: stats.losses,
    goalsFor: stats.goals_for,
    goalsAgainst: stats.goals_against,
  };
};
