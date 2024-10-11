import React from 'react';
import { Player } from '../types';

interface PlayerRankingProps {
  players: Player[];
}

const PlayerRanking: React.FC<PlayerRankingProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Player Rankings</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Matches</th>
              <th className="px-4 py-2 text-left">W</th>
              <th className="px-4 py-2 text-left">D</th>
              <th className="px-4 py-2 text-left">L</th>
              <th className="px-4 py-2 text-left">GF</th>
              <th className="px-4 py-2 text-left">GA</th>
              <th className="px-4 py-2 text-left">GD</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2">{player.score}</td>
                <td className="px-4 py-2">{player.matchesPlayed}</td>
                <td className="px-4 py-2">{player.wins}</td>
                <td className="px-4 py-2">{player.draws}</td>
                <td className="px-4 py-2">{player.losses}</td>
                <td className="px-4 py-2">{player.goalsFor}</td>
                <td className="px-4 py-2">{player.goalsAgainst}</td>
                <td className="px-4 py-2">{player.goalsFor - player.goalsAgainst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerRanking;