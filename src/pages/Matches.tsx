import ScoreInput from "../components/ScoreInput.tsx";
import MatchList from "../components/MatchList.tsx";
import { useAuth } from "../useAuth.ts";
import { useAppContext } from "../AppContext.tsx";

const Matches = () => {
  const { userRole } = useAuth();
  const { resetData, deleteAllMatches } = useAppContext();
  return (
    <>
      <ScoreInput />
      <MatchList />
      {userRole?.isAdmin ? (
        <button
          onClick={resetData}
          className="mt-8 mr-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Reset All Data
        </button>
      ) : null}
      {userRole?.isAdmin ? (
        <button
          onClick={deleteAllMatches}
          className="mt-8 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Reset All Matches
        </button>
      ) : null}
    </>
  );
};

export default Matches;
