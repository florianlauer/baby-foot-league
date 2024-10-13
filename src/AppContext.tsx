import React, { createContext, useContext, useState, useEffect } from "react";
import { Player, Match } from "./types";
import { supabase } from "./supabase";

// Créer le contexte

type AppContextValues = {
  players: Player[];
  matches: Match[];
  addPlayer: (name: string) => void;
  addMatch: (match: Match) => void;
  deleteMatch: (matchId: number) => void;
  deletePlayer: (playerId: number) => void;
  deleteAllMatches: () => void;
  resetData: () => void;
};

const appContextDefaultValue: AppContextValues = {
  players: [],
  matches: [],
  addPlayer: () => {},
  addMatch: () => {},
  deleteMatch: () => {},
  deletePlayer: () => {},
  deleteAllMatches: () => {},
  resetData: () => {},
};

const AppContext = createContext<AppContextValues>(appContextDefaultValue);

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchPlayers();
    fetchMatches();
  }, []);

  async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select("*");
    if (error) console.error("Error fetching players:", error);
    else setPlayers(data || []);
  }

  async function fetchMatches() {
    const { data, error } = await supabase.from("matches").select("*");
    if (error) console.error("Error fetching matches:", error);
    else setMatches(data || []);
  }

  const addPlayer = async (name: string) => {
    const newPlayer: Player = {
      id: Date.now(),
      name,
      score: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };
    const { error } = await supabase.from("players").insert(newPlayer);
    if (error) console.error("Error adding player:", error);
    else {
      setPlayers((prev) => [...prev, newPlayer]);
    }
  };

  const addMatch = async (match: Match) => {
    const { error } = await supabase.from("matches").insert(match);
    if (error) console.error("Error adding match:", error);
    else {
      setMatches((prev) => [...prev, match]);
      await updatePlayerStats(match);
    }
  };

  const updatePlayerStats = async (match: Match) => {
    // Extraire les joueurs des équipes
    const team1Players = match.team1;
    const team2Players = match.team2;
    const allPlayersInMatch = [...team1Players, ...team2Players];

    // Mettre à jour les statistiques de chaque joueur impliqué dans le match
    const updatedPlayers = players.map((player) => {
      if (allPlayersInMatch.includes(player.id)) {
        const isInTeam1 = team1Players.includes(player.id);
        const goalsFor = isInTeam1 ? match.score1 : match.score2;
        const goalsAgainst = isInTeam1 ? match.score2 : match.score1;
        const isWin = goalsFor > goalsAgainst;
        const isDraw = goalsFor === goalsAgainst;
        const isLoss = goalsFor < goalsAgainst;

        // Calculer les nouvelles statistiques du joueur
        return {
          ...player,
          matchesPlayed: player.matchesPlayed + 1,
          goalsFor: player.goalsFor + goalsFor,
          goalsAgainst: player.goalsAgainst + goalsAgainst,
          wins: player.wins + (isWin ? 1 : 0),
          draws: player.draws + (isDraw ? 1 : 0),
          losses: player.losses + (isLoss ? 1 : 0),
          score: player.score + (isWin ? 3 : isDraw ? 1 : 0), // 3 points pour une victoire, 1 pour un nul
        };
      }
      return player;
    });

    for (const player of updatedPlayers) {
      const { error } = await supabase
        .from("players")
        .update(player)
        .eq("id", player.id);
      if (error) console.error("Error updating player:", error);
    }

    setPlayers(updatedPlayers);
  };

  const deletePlayer = async (playerId: number) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId);
    if (error) {
      console.error("Error deleting player:", error);
    } else {
      setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    }
  };

  const deleteMatch = async (matchId: number) => {
    const { error } = await supabase.from("matches").delete().eq("id", matchId);
    if (error) {
      console.error("Error deleting match:", error);
    } else {
      setMatches((prev) => prev.filter((match) => match.id !== matchId));
    }
  };

  const deleteAllMatches = async () => {
    const { error } = await supabase.from("matches").delete();
    if (error) {
      console.error("Error deleting all matches:", error);
    } else {
      setMatches([]);
    }
  };

  const resetData = async () => {
    const { error: playersError } = await supabase
      .from("players")
      .delete()
      .neq("id", 0);
    const { error: matchesError } = await supabase
      .from("matches")
      .delete()
      .neq("id", 0);
    if (playersError) console.error("Error deleting players:", playersError);
    if (matchesError) console.error("Error deleting matches:", matchesError);
    setPlayers([]);
    setMatches([]);
  };

  return (
    <AppContext.Provider
      value={{
        players,
        matches,
        addPlayer,
        addMatch,
        deleteMatch,
        deletePlayer,
        deleteAllMatches,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAppContext = () => {
  return useContext(AppContext);
};
