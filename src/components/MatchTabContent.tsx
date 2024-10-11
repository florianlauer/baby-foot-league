import PlayerSelection from "./PlayerSelection.tsx";
import ScoreInput from "./ScoreInput.tsx";
import { Trash } from "lucide-react";
import { Match, Player } from "../types.ts";

const MatchTabContent = ({
  players,
  matches,
  onAddPlayer,
  onAddMatch,
  onDeleteMatch,
}: {
  players: Player[];
  matches: Match[];
  onAddPlayer: (name: string) => void;
  onAddMatch: (match: Match) => void;
  onDeleteMatch: (matchId: number) => void;
}) => {
  return (
    <>
      <PlayerSelection players={players} onAddPlayer={onAddPlayer} />
      <ScoreInput players={players} onAddMatch={onAddMatch} />
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
                      const player = players.find((p) => p.id === playerId);
                      return (
                        <span
                          key={playerId}
                          className={`max-w-[100px] overflow-hidden text-ellipsis ${
                            index > 0 ? "ml-2" : ""
                          }`}
                        >
                          {player?.name}
                        </span>
                      );
                    })}
                    {isTeam1Winner && (
                      <span className="text-red-600 text-2xl mx-2">🏆</span>
                    )}{" "}
                    {/* Emoji pour l'équipe 1 */}
                  </div>
                  <div
                    className="text-red-600 text-2xl mx-4"
                    style={{ width: "100px", textAlign: "center" }}
                  >
                    {`${match.score1} - ${match.score2}`}
                  </div>
                  <div
                    className="flex items-center justify-end"
                    style={{ flex: 1 }}
                  >
                    {isTeam2Winner && (
                      <span className="text-red-600 text-2xl mx-2">🏆</span>
                    )}{" "}
                    {/* Emoji pour l'équipe 2 */}
                    {match.team2.map((playerId, index) => {
                      const player = players.find((p) => p.id === playerId);
                      return (
                        <span
                          key={playerId}
                          className={`max-w-[100px] overflow-hidden text-ellipsis ${
                            index > 0 ? "ml-2" : ""
                          }`}
                        >
                          {player?.name}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    className="ml-4 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => onDeleteMatch(match.id)}
                    style={{ fontSize: "4px" }}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </ul>
      </div>
    </>
  );
};

export default MatchTabContent;
