import React from "react";
import { useParams } from "react-router-dom";

import { useAppContext } from "../AppContext.tsx";
import {
  getNemesisAndBestMatchup,
  getPlayerPartnersStats,
  getPlayerStats,
} from "../helpers/statsCalculator.ts";

const PlayerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { players, matches } = useAppContext();
  const playerId = parseInt(id!);
  const playerStats = getPlayerStats(playerId, players, matches);
  const { nemesis, bestMatchup } = getNemesisAndBestMatchup(
    playerId,
    players,
    matches
  );
  const { mostPlayedPartner, bestPartner, worstPartner } =
    getPlayerPartnersStats(playerId, players, matches);

  if (!playerStats) return <div>Player not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {playerStats.name}'s Statistics 📊
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">General Stats 🏆</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                🎮 Matches Played:{" "}
                <span className="font-semibold">
                  {playerStats.matches_played}
                </span>
              </li>
              <li>
                🏅 Wins:{" "}
                <span className="font-semibold text-green-600">
                  {playerStats.wins}
                </span>
              </li>
              <li>
                😓 Losses:{" "}
                <span className="font-semibold text-red-600">
                  {playerStats.losses}
                </span>
              </li>
              <li>
                🤝 Draws:{" "}
                <span className="font-semibold text-yellow-600">
                  {playerStats.draws}
                </span>
              </li>
              <li>
                ⚽ Goals Scored:{" "}
                <span className="font-semibold">{playerStats.goals_for}</span>
              </li>
              <li>
                🥅 Goals Conceded:{" "}
                <span className="font-semibold">
                  {playerStats.goals_against}
                </span>
              </li>
              <li>
                📈 Goal Difference:{" "}
                <span className="font-semibold">
                  {playerStats.goals_for - playerStats.goals_against}
                </span>
              </li>
              <li>
                🏆 Win Rate:{" "}
                <span className="font-semibold">
                  {(
                    (playerStats.wins / playerStats.matches_played) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Matchups 🤼 <span className="text-xs">(/winrate)</span>
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                😈 Nemesis:
                {nemesis ? (
                  <span className="font-semibold text-red-600">
                    {` ${nemesis.name} (W: ${nemesis.wins}, L: ${nemesis.losses}, WR: ${(nemesis.winRate * 100).toFixed(1)}%)`}
                  </span>
                ) : (
                  <span className="text-gray-500"> N/A</span>
                )}
              </li>
              <li>
                🦸 Best Matchup:
                {bestMatchup ? (
                  <span className="font-semibold text-green-600">
                    {` ${bestMatchup.name} (W: ${bestMatchup.wins}, L: ${bestMatchup.losses}, WR: ${(bestMatchup.winRate * 100).toFixed(1)}%)`}
                  </span>
                ) : (
                  <span className="text-gray-500"> N/A</span>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Partner Stats 🤝 <span className="text-xs">(/matchs number)</span>
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              🤼 Most Played Partner:
              {mostPlayedPartner ? (
                <span className="font-semibold">
                  {` ${mostPlayedPartner.name} (${mostPlayedPartner.matches} matches)`}
                </span>
              ) : (
                <span className="text-gray-500"> N/A</span>
              )}
            </li>
            <li>
              🏆 Best Partner:
              {bestPartner ? (
                <span className="font-semibold text-green-600">
                  {` ${bestPartner.name} (W: ${bestPartner.wins}, L: ${bestPartner.losses}, D: ${bestPartner.draws}, WR: ${(bestPartner.winRate * 100).toFixed(1)}%)`}
                </span>
              ) : (
                <span className="text-gray-500"> N/A</span>
              )}
            </li>
            <li>
              😓 Worst Partner:
              {worstPartner ? (
                <span className="font-semibold text-red-600">
                  {` ${worstPartner.name} (W: ${worstPartner.wins}, L: ${worstPartner.losses}, D: ${worstPartner.draws}, WR: ${(worstPartner.winRate * 100).toFixed(1)}%)`}
                </span>
              ) : (
                <span className="text-gray-500"> N/A</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
