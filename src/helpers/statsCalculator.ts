import { Match, Player, PlayerStats } from "../types";

export function calculatePlayerStats(
  players: Player[],
  matches: Match[]
): PlayerStats[] {
  const stats: { [key: number]: PlayerStats } = {};

  // Initialize stats for all players
  players.forEach((player) => {
    stats[player.id] = {
      id: player.id,
      name: player.name,
      score: 0,
      matches_played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      goals_for: 0,
      goals_against: 0,
      win_rate: 0,
      goal_difference: 0,
    };
  });

  // Calculate stats based on matches
  matches.forEach((match) => {
    const team1 = [match.team1[0], match.team1[1]];
    const team2 = [match.team2[0], match.team2[1]];
    const allPlayers = [...team1, ...team2];

    allPlayers.forEach((playerName) => {
      const player = players.find((p) => p.id === playerName);
      if (player) {
        const playerStats = stats[player.id];
        playerStats.matches_played++;

        if (team1.includes(playerName)) {
          playerStats.goals_for += match.score1;
          playerStats.goals_against += match.score2;
          if (match.score1 > match.score2) {
            playerStats.wins++;
            playerStats.score += 3;
          } else if (match.score1 < match.score2) {
            playerStats.losses++;
          } else {
            playerStats.draws++;
            playerStats.score += 1;
          }
        } else {
          playerStats.goals_for += match.score2;
          playerStats.goals_against += match.score1;
          if (match.score2 > match.score1) {
            playerStats.wins++;
            playerStats.score += 3;
          } else if (match.score2 < match.score1) {
            playerStats.losses++;
          } else {
            playerStats.draws++;
            playerStats.score += 1;
          }
        }
      }
    });
  });

  // Calculate win_rate for each player
  Object.values(stats).forEach((playerStats) => {
    if (playerStats.matches_played > 0) {
      playerStats.win_rate =
        (playerStats.wins / playerStats.matches_played) * 100;
    } else {
      playerStats.win_rate = 0;
    }

    // Calculate goal difference
    playerStats.goal_difference =
      playerStats.goals_for - playerStats.goals_against;
  });

  return Object.values(stats).sort((a, b) => b.score - a.score);
}

export function getPlayerStats(
  playerId: number,
  players: Player[],
  matches: Match[]
): PlayerStats | null {
  const allStats = calculatePlayerStats(players, matches);
  return allStats.find((stats) => stats.id === playerId) || null;
}

export function getNemesisAndBestMatchup(
  playerId: number,
  players: Player[],
  matches: Match[]
): {
  nemesis: {
    name: string;
    wins: number;
    losses: number;
    winRate: number;
  } | null;
  bestMatchup: {
    name: string;
    wins: number;
    losses: number;
    winRate: number;
  } | null;
} {
  const player = players.find((p) => p.id === playerId);
  if (!player) return { nemesis: null, bestMatchup: null };

  const opponents: { [key: string]: { wins: number; losses: number } } = {};

  matches.forEach((match) => {
    const isTeam1 =
      match.team1[0] === player.id || match.team1[1] === player.id;
    const opposingTeam = isTeam1
      ? [match.team2[0], match.team2[1]]
      : [match.team1[0], match.team1[1]];
    const playerWon = isTeam1
      ? match.score1 > match.score2
      : match.score2 > match.score1;

    opposingTeam.forEach((opponent) => {
      if (opponent !== player.id) {
        if (!opponents[opponent]) {
          opponents[opponent] = { wins: 0, losses: 0 };
        }
        if (playerWon) {
          opponents[opponent].wins++;
        } else {
          opponents[opponent].losses++;
        }
      }
    });
  });

  let nemesis = null;
  let bestMatchup = null;
  let worstWinRate = 1;
  let bestWinRate = 0;

  Object.entries(opponents).forEach(([opponent, record]) => {
    const totalGames = record.wins + record.losses;
    if (totalGames > 0) {
      const winRate = record.wins / totalGames;
      if (winRate < worstWinRate) {
        worstWinRate = winRate;
        nemesis = { name: opponent, ...record, winRate };
      }
      if (winRate > bestWinRate) {
        bestWinRate = winRate;
        bestMatchup = { name: opponent, ...record, winRate };
      }
    }
  });

  return { nemesis, bestMatchup };
}
