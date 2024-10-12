import PlayerSelection from "./PlayerSelection.tsx";
import ScoreInput from "./ScoreInput.tsx";
import MatchList from "./MatchList.tsx";
import { useAuth } from "../useAuth.ts";
import { useAppContext } from "../AppContext.tsx";

const MatchTabContent = () => {
  const { userRole } = useAuth();
  const { resetData } = useAppContext();
  return (
    <>
      <PlayerSelection />
      <ScoreInput />
      <MatchList />
      {userRole?.isAdmin ? (
        <button
          onClick={resetData}
          className="mt-8 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Reset All Data
        </button>
      ) : null}
    </>
  );
};

export default MatchTabContent;
