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
  resetData: () => void;
};

const appContextDefaultValue: AppContextValues = {
  players: [],
  matches: [],
  addPlayer: () => {},
  addMatch: () => {},
  deleteMatch: () => {},
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
    const updatedPlayers = players.map((player) => {
      const updatedPlayer = { ...player };
      if (match.team1.includes(player.id) || match.team2.includes(player.id)) {
        updatedPlayer.matchesPlayed++;
        if (match.team1.includes(player.id)) {
          updatedPlayer.goalsFor += match.score1;
          updatedPlayer.goalsAgainst += match.score2;
          if (match.score1 > match.score2) {
            updatedPlayer.wins++;
            updatedPlayer.score += 3;
          } else if (match.score1 < match.score2) {
            updatedPlayer.losses++;
          } else {
            updatedPlayer.draws++;
            updatedPlayer.score += 1;
          }
        } else {
          updatedPlayer.goalsFor += match.score2;
          updatedPlayer.goalsAgainst += match.score1;
          if (match.score2 > match.score1) {
            updatedPlayer.wins++;
            updatedPlayer.score += 3;
          } else if (match.score2 < match.score1) {
            updatedPlayer.losses++;
          } else {
            updatedPlayer.draws++;
            updatedPlayer.score += 1;
          }
        }
      }
      return updatedPlayer;
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

  const deleteMatch = async (matchId: number) => {
    const { error } = await supabase.from("matches").delete().eq("id", matchId);
    if (error) {
      console.error("Error deleting match:", error);
    } else {
      setMatches((prev) => prev.filter((match) => match.id !== matchId));
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
