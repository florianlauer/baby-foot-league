import React from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

const NewHeader = ({ onLogout }: { onLogout: VoidFunction }) => {
  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Trophy size={32} />
          <span className="text-xl font-bold">Baby Foot League</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-green-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="hover:text-green-200">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/matches" className="hover:text-green-200">
                Matches
              </Link>
            </li>
            <li>
              <Link to={""} onClick={onLogout} className="hover:text-green-200">
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NewHeader;
