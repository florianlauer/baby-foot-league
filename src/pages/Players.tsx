import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, UserPlus } from "lucide-react";
import { useAppContext } from "../AppContext";
import { useAuth } from "../useAuth.ts";

const Players = () => {
  const { players, addPlayer, deletePlayer } = useAppContext();
  const [newPlayerName, setNewPlayerName] = useState("");
  const { userRole } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName("");
    }
  };

  console.log(players);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Players 🏃</h1>
      {userRole?.isAdmin ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="flex-grow p-2 border rounded-l"
            />
            <button
              type="submit"
              className="bg-green-700 text-white p-2 rounded-r flex items-center hover:bg-green-800 transition-colors"
            >
              <UserPlus size={20} className="mr-2" />
              Add Player
            </button>
          </div>
        </form>
      ) : null}
      <ul className="space-y-2">
        {players.map((player) => (
          <li
            key={player.id}
            className="flex items-center justify-between bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
          >
            <Link
              to={`/players/${player.id}`}
              className="text-green-700 hover:underline flex items-center"
            >
              {player.name}
            </Link>
            {userRole?.isAdmin ? (
              <button
                onClick={() => deletePlayer(player.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;
