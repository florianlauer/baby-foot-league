import PlayerSelection from "./PlayerSelection.tsx";
import ScoreInput from "./ScoreInput.tsx";
import { Match, Player } from "../types.ts";
import MatchList from "./MatchList.tsx";
import { useAuth } from "../useAuth.ts";

const MatchTabContent = ({
  players,
  matches,
  onAddPlayer,
  onAddMatch,
  onDeleteMatch,
  onResetData,
}: {
  players: Player[];
  matches: Match[];
  onAddPlayer: (name: string) => void;
  onAddMatch: (match: Match) => void;
  onDeleteMatch: (matchId: number) => void;
  onResetData: () => void;
}) => {
  const { userRole } = useAuth();
  return (
    <>
      <PlayerSelection players={players} onAddPlayer={onAddPlayer} />
      <ScoreInput players={players} onAddMatch={onAddMatch} />
      <MatchList
        players={players}
        matches={matches}
        onDeleteMatch={onDeleteMatch}
      />
      {userRole?.isAdmin ? (
        <button
          onClick={onResetData}
          className="mt-8 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Reset All Data
        </button>
      ) : null}
    </>
  );
};

export default MatchTabContent;
