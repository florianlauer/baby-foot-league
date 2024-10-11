import React, { useState } from 'react';
import { Player } from '../types';

interface PlayerSelectionProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({
  players,
  onAddPlayer,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Players list</h2>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:bg-green-700"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 text-white rounded-r-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:bg-green-700"
        >
          Add Player
        </button>
      </form>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {players.map((player) => (
          <li
            key={player.id}
            className="bg-gray-100 px-3 py-2 rounded-md text-center"
          >
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerSelection;
