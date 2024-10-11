import React, { useState } from 'react';
import { Player, Match } from '../types';

interface ScoreInputProps {
  players: Player[];
  onAddMatch: (match: Match) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ players, onAddMatch }) => {
  const [team1Player1, setTeam1Player1] = useState<number | ''>('');
  const [team1Player2, setTeam1Player2] = useState<number | ''>('');
  const [team2Player1, setTeam2Player1] = useState<number | ''>('');
  const [team2Player2, setTeam2Player2] = useState<number | ''>('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      team1Player1 !== '' &&
      team1Player2 !== '' &&
      team2Player1 !== '' &&
      team2Player2 !== ''
    ) {
      const newMatch: Match = {
        id: Date.now(),
        team1: [team1Player1, team1Player2],
        team2: [team2Player1, team2Player2],
        score1: parseInt(score1) || 0,
        score2: parseInt(score2) || 0,
      };
      onAddMatch(newMatch);
      setTeam1Player1('');
      setTeam1Player2('');
      setTeam2Player1('');
      setTeam2Player2('');
      setScore1('');
      setScore2('');
    } else {
      alert('Please select 2 players for each team');
    }
  };

  const isPlayerDisabled = (playerId: number) => {
    return (
      playerId === team1Player1 ||
      playerId === team1Player2 ||
      playerId === team2Player1 ||
      playerId === team2Player2
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Enter Match Score</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Team 1</h3>
            <select
              value={team1Player1}
              onChange={(e) => setTeam1Player1(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Player 1</option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={isPlayerDisabled(player.id)}
                >
                  {player.name}
                </option>
              ))}
            </select>
            <select
              value={team1Player2}
              onChange={(e) => setTeam1Player2(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md mt-2"
            >
              <option value="">Select Player 2</option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={isPlayerDisabled(player.id)}
                >
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Team 2</h3>
            <select
              value={team2Player1}
              onChange={(e) => setTeam2Player1(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Player 1</option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={isPlayerDisabled(player.id)}
                >
                  {player.name}
                </option>
              ))}
            </select>
            <select
              value={team2Player2}
              onChange={(e) => setTeam2Player2(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md mt-2"
            >
              <option value="">Select Player 2</option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={isPlayerDisabled(player.id)}
                >
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="score1" className="block font-semibold mb-2">
              Team 1 Score
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScore1(i.toString())}
                  className={`px-2 py-2 rounded-md ${
                    score1 === i.toString()
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="score2" className="block font-semibold mb-2">
              Team 2 Score
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScore2(i.toString())}
                  className={`px-2 py-2 rounded-md ${
                    score2 === i.toString()
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          Submit Match
        </button>
      </form>
    </div>
  );
};

export default ScoreInput;
