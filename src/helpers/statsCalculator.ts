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

    allPlayers.forEach((playerId) => {
      const player = players.find((p) => p.id === playerId);
      if (player) {
        const playerStats = stats[player.id];
        playerStats.matches_played++;

        if (team1.includes(playerId)) {
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
    const isInTeam1 = match.team1.includes(player.id);
    const isInTeam2 = match.team2.includes(player.id);

    // Si le joueur ne fait pas partie de ce match, on ignore
    if (!isInTeam1 && !isInTeam2) return;

    // Déterminer si le joueur a gagné ou perdu le match
    const playerWon =
      (isInTeam1 && match.score1 > match.score2) ||
      (isInTeam2 && match.score2 > match.score1);

    // Définir l'équipe adverse
    const opposingTeam = isInTeam1 ? match.team2 : match.team1;

    opposingTeam.forEach((opponentId) => {
      if (opponentId !== player.id) {
        if (!opponents[opponentId]) {
          opponents[opponentId] = { wins: 0, losses: 0 };
        }

        // Ajouter les résultats correctement selon que le joueur a gagné ou perdu
        if (playerWon) {
          opponents[opponentId].wins++;
        } else {
          opponents[opponentId].losses++;
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
    const opponentName = players.find((p) => p.id === Number(opponent))?.name;

    console.log(opponentName, record.wins, record.losses); // Debug: Afficher les résultats calculés

    if (totalGames > 0) {
      const winRate = record.wins / totalGames;

      // Condition pour nemesis : joueur doit avoir perdu contre cet adversaire
      if (winRate < worstWinRate && record.losses > 0) {
        worstWinRate = winRate;
        nemesis = { name: opponentName, ...record, winRate };
      }

      // Condition pour best matchup : joueur doit avoir gagné contre cet adversaire
      if (winRate > bestWinRate && record.wins > 0) {
        bestWinRate = winRate;
        bestMatchup = { name: opponentName, ...record, winRate };
      }
    }
  });

  // Si le joueur n'a jamais perdu, pas de nemesis
  if (worstWinRate === 1) {
    nemesis = null;
  }

  // Si le joueur n'a jamais gagné, pas de best matchup
  if (bestWinRate === 0) {
    bestMatchup = null;
  }

  return { nemesis, bestMatchup };
}

export function getPlayerPartnersStats(
  playerId: number,
  players: Player[],
  matches: Match[]
): {
  mostPlayedPartner: { name: string; matches: number } | null;
  bestPartner: {
    name: string;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  } | null;
  worstPartner: {
    name: string;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  } | null;
} {
  const player = players.find((p) => p.id === playerId);
  if (!player)
    return { mostPlayedPartner: null, bestPartner: null, worstPartner: null };

  const partnerStats: {
    [key: string]: {
      matches: number;
      wins: number;
      losses: number;
      draws: number;
    };
  } = {};

  matches.forEach((match) => {
    let partner: number | null = null;
    let isWin = false;
    let isDraw = false;

    if (match.team1[0] === player.id) {
      partner = match.team1[1];
      isWin = match.score1 > match.score2;
      isDraw = match.score1 === match.score2;
    } else if (match.team1[1] === player.id) {
      partner = match.team1[0];
      isWin = match.score1 > match.score2;
      isDraw = match.score1 === match.score2;
    } else if (match.team2[0] === player.id) {
      partner = match.team2[1];
      isWin = match.score2 > match.score1; // Corrigé
      isDraw = match.score1 === match.score2;
    } else if (match.team2[1] === player.id) {
      partner = match.team2[0];
      isWin = match.score2 > match.score1; // Corrigé
      isDraw = match.score1 === match.score2;
    }

    if (partner) {
      if (!partnerStats[partner]) {
        partnerStats[partner] = { matches: 0, wins: 0, losses: 0, draws: 0 };
      }
      partnerStats[partner].matches++;
      if (isWin) {
        partnerStats[partner].wins++;
      } else if (isDraw) {
        partnerStats[partner].draws++;
      } else {
        partnerStats[partner].losses++;
      }
    }
  });

  let mostPlayedPartner: { name: string; matches: number } | null = null;
  let bestPartner: {
    name: string;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  } | null = null;
  let worstPartner: {
    name: string;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  } | null = null;

  Object.entries(partnerStats).forEach(([partnerId, stats]) => {
    const partnerPlayer = players.find((p) => p.id === Number(partnerId));
    const partnerName = partnerPlayer ? partnerPlayer.name : "Unknown";
    const winRate = stats.wins / stats.matches;

    if (!mostPlayedPartner || stats.matches > mostPlayedPartner.matches) {
      mostPlayedPartner = { name: partnerName, matches: stats.matches };
    }

    if (!bestPartner || winRate > bestPartner.winRate) {
      bestPartner = { name: partnerName, ...stats, winRate };
    }

    if (!worstPartner || winRate < worstPartner.winRate) {
      worstPartner = { name: partnerName, ...stats, winRate };
    }
  });

  return { mostPlayedPartner, bestPartner, worstPartner };
}
