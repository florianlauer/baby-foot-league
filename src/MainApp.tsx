import React, { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import PlayerRanking from "./components/PlayerRanking";
import { Player, Match } from "./types";
import { supabase } from "./supabase";
import MatchTabContent from "./components/MatchTabContent.tsx";

function MainApp() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<"match" | "ranking">("match");

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
    console.log(data);
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
      setPlayers([...players, newPlayer]);
    }
  };

  const addMatch = async (match: Match) => {
    const { error } = await supabase.from("matches").insert(match);
    if (error) console.error("Error adding match:", error);
    else {
      setMatches([...matches, match]);
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
      setMatches(matches.filter((match) => match.id !== matchId));
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700 flex items-center justify-center">
          <Trophy className="mr-2" /> Baby league
        </h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Onglets */}
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setActiveTab("match")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "match" ? "bg-green-700 text-white" : "bg-gray-200"
            }`}
          >
            Add a match
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "ranking"
                ? "bg-green-700 text-white"
                : "bg-gray-200"
            }`}
          >
            Leaderboard
          </button>
        </div>
        {activeTab === "match" ? (
          <MatchTabContent
            players={players}
            matches={matches}
            onAddMatch={addMatch}
            onDeleteMatch={deleteMatch}
            onAddPlayer={addPlayer}
            onResetData={resetData}
          />
        ) : (
          <PlayerRanking players={players} />
        )}
      </div>
    </div>
  );
}

export default MainApp;
