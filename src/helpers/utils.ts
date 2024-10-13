import { Player } from "../types.ts";

export const calculatePlayerWinRate = (player: Player): string => {
  const { wins, matchesPlayed } = player;
  if (matchesPlayed === 0) return "0";
  // arrondir a l'unité
  return Math.round((wins / matchesPlayed) * 100).toFixed(0);
};
