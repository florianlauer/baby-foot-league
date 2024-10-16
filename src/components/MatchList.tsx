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

  // Trier les dates des plus récentes aux plus anciennes
  const sortedDates = Object.keys(matchesByDate).sort((a, b) => {
    return (
      DateTime.fromFormat(b, "dd/MM/yyyy").toMillis() -
      DateTime.fromFormat(a, "dd/MM/yyyy").toMillis()
    );
  });

  // Fonction pour afficher "Aujourd'hui", "Hier" ou la date formatée
  const formatDateLabel = (dateString: string) => {
    const date = DateTime.fromFormat(dateString, "dd/MM/yyyy");
    const today = DateTime.now();
    const yesterday = today.minus({ days: 1 });

    if (date.hasSame(today, "day")) {
      return "Today";
    } else if (date.hasSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return dateString;
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Matches ⚽</h2>
      <ul className="bg-white rounded-md shadow-md">
        {sortedDates.map((date, index) => (
          <div
            key={date}
            className={`p-4 ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
          >
            <div className="text-ll font-bold text-gray-600 mb-3 mt-3 text-center">
              🗓️ {formatDateLabel(date)}
            </div>

            {/* Version Desktop */}
            <div className="hidden md:block">
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
                              className={`max-w-[100px] overflow-hidden text-ellipsis`}
                            >
                              {player?.name}
                              {index < match.team1.length - 1 && (
                                <span className="mx-1">&</span>
                              )}
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
                              className={`max-w-[100px] overflow-hidden text-ellipsis`}
                            >
                              {player?.name}
                              {index < match.team2.length - 1 && (
                                <span className="mx-1">&</span>
                              )}
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

            {/* Version Mobile */}
            <div className="block md:hidden">
              <div className="flex flex-col space-y-4">
                {matchesByDate[date].map((match) => {
                  const isTeam1Winner = match.score1 > match.score2;
                  const isTeam2Winner = match.score2 > match.score1;

                  return (
                    <div
                      key={match.id}
                      className="bg-green-50 border border-green-700 px-2 py-2 rounded-lg space-y-4"
                    >
                      {/* Equipe 1 */}
                      <div className="flex items-center justify-center">
                        {match.team1.map((playerId, index) => {
                          const player = players.find((p) => p.id === playerId);
                          return (
                            <span
                              key={playerId}
                              className="max-w-[100px] overflow-hidden text-ellipsis"
                            >
                              {player?.name}
                              {index < match.team1.length - 1 && (
                                <span className="mx-1">&</span>
                              )}
                            </span>
                          );
                        })}
                        {isTeam1Winner && (
                          <span className="text-red-600 text-2xl mx-2">🏆</span>
                        )}
                      </div>

                      {/* Score */}
                      <div className="text-red-600 text-2xl text-center">
                        {`${match.score1} - ${match.score2}`}
                      </div>

                      {/* Equipe 2 */}
                      <div className="flex items-center justify-center">
                        {isTeam2Winner && (
                          <span className="text-red-600 text-2xl mx-2">🏆</span>
                        )}
                        {match.team2.map((playerId, index) => {
                          const player = players.find((p) => p.id === playerId);
                          return (
                            <span
                              key={playerId}
                              className="max-w-[100px] overflow-hidden text-ellipsis"
                            >
                              {player?.name}
                              {index < match.team2.length - 1 && (
                                <span className="mx-1">&</span>
                              )}
                            </span>
                          );
                        })}
                      </div>

                      {/* Bouton supprimer */}
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
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
