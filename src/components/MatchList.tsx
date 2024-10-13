import { Trash2 } from "lucide-react";
import { Match } from "../types.ts";
import { DateTime } from "luxon";
import { useAuth } from "../useAuth.ts";
import { useAppContext } from "../AppContext.tsx";

const MatchList = () => {
  const { userRole } = useAuth();
  const { players, matches, deleteMatch } = useAppContext();
  // Grouper les matchs par date
  const matchesByDate = matches.reduce(
    (acc: { [key: string]: Match[] }, match) => {
      const matchDate = DateTime.fromISO(match.created_at).toFormat(
        "dd/MM/yyyy"
      );
      if (!acc[matchDate]) {
        acc[matchDate] = [];
      }
      acc[matchDate].push(match);
      return acc;
    },
    {}
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Matches ⚽</h2>
      <ul className="bg-white rounded-md shadow-md p-4">
        {/* Parcourir les dates et afficher les matchs du jour */}
        {Object.keys(matchesByDate).map((date) => (
          <div key={date}>
            {/* Afficher la date */}
            <div className="text-ll font-bold text-gray-600 mb-3 mt-3 text-center">
              🗓️ {date}
            </div>
            <div className="flex flex-col space-y-4">
              {matchesByDate[date].map((match) => {
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
                      )}
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
                      )}
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
                    {userRole?.isAdmin ? (
                      <button
                        className="ml-4 text-red-500 hover:text-red-700"
                        onClick={() => deleteMatch(match.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
