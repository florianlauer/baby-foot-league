import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import PlayerSelection from './components/PlayerSelection';
import ScoreInput from './components/ScoreInput';
import PlayerRanking from './components/PlayerRanking';
import { Player, Match } from './types';
import { supabase } from './supabase';

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'match' | 'ranking'>('match');

  useEffect(() => {
    fetchPlayers();
    fetchMatches();
  }, []);

  async function fetchPlayers() {
    const { data, error } = await supabase.from('players').select('*');
    if (error) console.error('Error fetching players:', error);
    else setPlayers(data || []);
  }

  async function fetchMatches() {
    const { data, error } = await supabase.from('matches').select('*');
    if (error) console.error('Error fetching matches:', error);
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
    const { data, error } = await supabase.from('players').insert(newPlayer);
    if (error) console.error('Error adding player:', error);
    else {
      setPlayers([...players, newPlayer]);
    }
  };

  const addMatch = async (match: Match) => {
    const { data, error } = await supabase.from('matches').insert(match);
    if (error) console.error('Error adding match:', error);
    else {
      setMatches([...matches, match]);
      await updatePlayerStats(match);
    }
  };

  const updatePlayerStats = async (match: Match) => {
    const updatedPlayers = players.map((player) => {
      let updatedPlayer = { ...player };
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
        .from('players')
        .update(player)
        .eq('id', player.id);
      if (error) console.error('Error updating player:', error);
    }

    setPlayers(updatedPlayers);
  };

  const resetData = async () => {
    const { error: playersError } = await supabase
      .from('players')
      .delete()
      .neq('id', 0);
    const { error: matchesError } = await supabase
      .from('matches')
      .delete()
      .neq('id', 0);
    if (playersError) console.error('Error deleting players:', playersError);
    if (matchesError) console.error('Error deleting matches:', matchesError);
    setPlayers([]);
    setMatches([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700 flex items-center justify-center">
          <Trophy className="mr-2" /> Sencrop Baby league
        </h1>
      </header>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Onglets */}
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'match' ? 'bg-green-700 text-white' : 'bg-gray-200'
            }`}
          >
            Add a match
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'ranking'
                ? 'bg-green-700 text-white'
                : 'bg-gray-200'
            }`}
          >
            Leaderboard
          </button>
        </div>
        {activeTab === 'match' ? (
          <>
            <PlayerSelection players={players} onAddPlayer={addPlayer} />
            <ScoreInput players={players} onAddMatch={addMatch} />
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Match history</h2>
              <ul className="bg-white rounded-md shadow-md p-4">
                <div className="flex flex-col space-y-4">
                  {matches.map((match) => {
                    // Déterminer l'équipe gagnante
                    const isTeam1Winner = match.score1 > match.score2;
                    const isTeam2Winner = match.score2 > match.score1;

                    return (
                      <div
                        key={match.id}
                        className="bg-green-50 border border-green-700 px-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center" style={{ flex: 1 }}>
                          {match.team1.map((playerId, index) => {
                            const player = players.find(
                              (p) => p.id === playerId
                            );
                            return (
                              <span
                                key={playerId}
                                className={`max-w-[100px] overflow-hidden text-ellipsis ${
                                  index > 0 ? 'ml-2' : ''
                                }`}
                              >
                                {player?.name}
                              </span>
                            );
                          })}
                          {isTeam1Winner && (
                            <span className="text-red-600 text-2xl mx-2">
                              🏆
                            </span>
                          )}{' '}
                          {/* Emoji pour l'équipe 1 */}
                        </div>
                        <div
                          className="text-red-600 text-2xl mx-4"
                          style={{ width: '100px', textAlign: 'center' }}
                        >
                          {`${match.score1} - ${match.score2}`}
                        </div>
                        <div
                          className="flex items-center justify-end"
                          style={{ flex: 1 }}
                        >
                          {isTeam2Winner && (
                            <span className="text-red-600 text-2xl mx-2">
                              🏆
                            </span>
                          )}{' '}
                          {/* Emoji pour l'équipe 2 */}
                          {match.team2.map((playerId, index) => {
                            const player = players.find(
                              (p) => p.id === playerId
                            );
                            return (
                              <span
                                key={playerId}
                                className={`max-w-[100px] overflow-hidden text-ellipsis ${
                                  index > 0 ? 'ml-2' : ''
                                }`}
                              >
                                {player?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ul>
            </div>
          </>
        ) : (
          <PlayerRanking players={players} />
        )}
      </div>
    </div>
  );
}

export default App;
