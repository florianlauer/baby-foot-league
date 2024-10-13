import { useAppContext } from "../AppContext.tsx";
import { useEffect, useState } from "react";
import { PlayerStats } from "../types.ts";
import { calculatePlayerStats } from "../helpers/statsCalculator.ts";
import { Link } from "react-router-dom";

const Rankings = () => {
  const { players, matches } = useAppContext();
  const [rankings, setRankings] = useState<PlayerStats[]>(
    calculatePlayerStats(players, matches)
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof PlayerStats;
    direction: "ascending" | "descending";
  }>({ key: "score", direction: "descending" });

  const sortBy = (key: keyof PlayerStats) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const sortedRankings = [...rankings].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setRankings(sortedRankings);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof PlayerStats) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return null;
  };

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

  // Effet pour recalculer les rankings lorsque les données sont disponibles
  useEffect(() => {
    if (players.length > 0 && matches.length > 0) {
      const calculatedStats = calculatePlayerStats(players, matches);
      setRankings(calculatedStats);
    }
  }, [players, matches]); // Déclencher l'effet lorsqu'il y a des changements dans players ou matches

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Rankings 🏆</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-700 text-white">
            <tr>
              {[
                { key: "rank", label: "Rank" },
                { key: "name", label: "Name" },
                { key: "score", label: "Score" },
                { key: "matches_played", label: "Matches" },
                { key: "wins", label: "W" },
                { key: "losses", label: "L" },
                { key: "draws", label: "D" },
                { key: "goals_for", label: "GF" },
                { key: "goals_against", label: "GA" },
                { key: "goal_difference", label: "GD" },
                { key: "win_rate", label: "Win Rate" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-2 cursor-pointer hover:bg-green-700"
                  onClick={() => sortBy(key as keyof PlayerStats)}
                >
                  {label} {getSortIcon(key as keyof PlayerStats)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rankings.map((player, index) => (
              <tr
                key={player.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2 text-center">{getMedal(index + 1)}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/players/${player.id}`}
                    className="text-green-700 hover:underline"
                  >
                    {player.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-center font-semibold">
                  {player.score}
                </td>
                <td className="px-4 py-2 text-center">
                  {player.matches_played}
                </td>
                <td className="px-4 py-2 text-center text-green-600">
                  {player.wins}
                </td>
                <td className="px-4 py-2 text-center text-red-600">
                  {player.losses}
                </td>
                <td className="px-4 py-2 text-center text-yellow-600">
                  {player.draws}
                </td>
                <td className="px-4 py-2 text-center">{player.goals_for}</td>
                <td className="px-4 py-2 text-center">
                  {player.goals_against}
                </td>
                <td className="px-4 py-2 text-center">
                  {player.goals_for - player.goals_against}
                </td>
                <td className="px-4 py-2 text-center">
                  {player.matches_played > 0
                    ? `${((player.wins / player.matches_played) * 100).toFixed(1)}%`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rankings;
